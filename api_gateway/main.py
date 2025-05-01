from fastapi import FastAPI, Request, HTTPException
from contextlib import asynccontextmanager
import aio_pika
from aio_pika.abc import AbstractIncomingMessage
import json
import uuid
import asyncio
from typing import Dict, Optional
import logging
import uvicorn

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Конфигурация
SERVICE_QUEUES = {
    "educationProfileService": "educationProfile_queue",
    "analyticService": "analytic_queue",
}
RESPONSE_TIMEOUT = 1  # seconds


class Settings:
    RABBITMQ_HOST: str = "localhost"  # Или "rabbitmq" если в Docker
    RABBITMQ_PORT: int = 5672  # Правильный порт AMQP
    RABBITMQ_USER: str = "rmuser"
    RABBITMQ_PASSWORD: str = "rmpassword"
    RABBITMQ_VHOST: str = "/"  # Виртуальный хост


class RabbitMQClient:
    def __init__(self):
        self.connection: Optional[aio_pika.RobustConnection] = None
        self.channel: Optional[aio_pika.abc.AbstractChannel] = None
        self.callback_queue: Optional[aio_pika.abc.AbstractQueue] = None
        self.pending_responses: Dict[str, asyncio.Future] = {}

    async def connect(self, settings):
        """Установка соединения с RabbitMQ и объявление очередей"""
        try:
            self.connection = await aio_pika.connect_robust(
                host=settings.RABBITMQ_HOST,
                port=settings.RABBITMQ_PORT,
                login=settings.RABBITMQ_USER,
                password=settings.RABBITMQ_PASSWORD,
                virtualhost=settings.RABBITMQ_VHOST
            )
            self.channel = await self.connection.channel()

            # Объявляем очереди для каждого сервиса
            for queue_name in SERVICE_QUEUES.values():
                await self.channel.declare_queue(
                    queue_name,
                    durable=True,  # Очередь переживет перезапуск RabbitMQ
                    auto_delete=False,
                )

            # Callback-очередь для ответов
            self.callback_queue = await self.channel.declare_queue(
                exclusive=True,
                durable=False,
                auto_delete=True
            )

            await self._setup_consumer()
            logger.info("Successfully connected to RabbitMQ and declared queues")
            return True
        except ConnectionError as e:
            logger.error(f"Connection error: {e}")
            raise HTTPException(
                status_code=503,
                detail="Service unavailable - cannot connect to RabbitMQ"
            )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

    async def _setup_consumer(self):
        """Настройка потребителя для обработки ответов"""
        async def on_response(message: AbstractIncomingMessage):
            async with message.process():
                correlation_id = message.correlation_id
                if correlation_id in self.pending_responses:
                    future = self.pending_responses.pop(correlation_id)
                    try:
                        response_data = json.loads(message.body.decode())
                        future.set_result({
                            "status_code": message.headers.get("status_code", 200),
                            "body": response_data
                        })
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON decode error: {e}")
                        future.set_exception(ValueError("Invalid JSON response"))

        await self.callback_queue.consume(on_response)

    async def send_to_service(self, service_name: str, payload: dict) -> dict:
        """Отправка сообщения в сервис через RabbitMQ"""
        if service_name not in SERVICE_QUEUES:
            raise ValueError(f"Service {service_name} not found")

        correlation_id = str(uuid.uuid4())
        future = asyncio.Future()
        self.pending_responses[correlation_id] = future

        try:
            await self.channel.default_exchange.publish(
                aio_pika.Message(
                    body=json.dumps(payload).encode(),
                    correlation_id=correlation_id,
                    reply_to=self.callback_queue.name,
                    headers={"service": service_name},
                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT
                ),
                routing_key=SERVICE_QUEUES[service_name],
            )
            logger.info(f"Message sent to {service_name} service")

            return await asyncio.wait_for(future, timeout=RESPONSE_TIMEOUT)
        except asyncio.TimeoutError:
            self.pending_responses.pop(correlation_id, None)
            logger.warning(f"Timeout waiting for {service_name} service response")
            raise HTTPException(status_code=504, detail="Service timeout")
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    async def close(self):
        """Закрытие соединений"""
        try:
            if self.connection:
                await self.connection.close()
            self.pending_responses.clear()
            logger.info("RabbitMQ connection closed successfully")
        except Exception as e:
            logger.error(f"Error closing connection: {e}")


# Инициализация FastAPI с lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    rabbitmq_client = RabbitMQClient()

    try:
        await rabbitmq_client.connect(settings)
        app.state.rabbitmq = rabbitmq_client
        logger.info("API Gateway started successfully")
        yield
    except Exception as e:
        logger.critical(f"Failed to start API Gateway: {e}")
        raise
    finally:
        await rabbitmq_client.close()


app = FastAPI(
    lifespan=lifespan,
    title="API Gateway",
    description="Gateway for microservices communication via RabbitMQ",
    version="1.0.0"
)


@app.api_route("/{service_name}/{path:path}",
               methods=["GET", "POST", "PUT", "DELETE"],
               summary="Route requests to microservices")
async def gateway(service_name: str, path: str, request: Request):
    """Основной endpoint API Gateway"""
    try:
        payload = {
            "path": path,
            "method": request.method,
            "headers": dict(request.headers),
            "query_params": dict(request.query_params),
        }

        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                payload["body"] = await request.json()
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid JSON payload"
                )

        rabbitmq_client: RabbitMQClient = request.app.state.rabbitmq
        if not rabbitmq_client or not rabbitmq_client.connection:
            raise HTTPException(
                status_code=503,
                detail="Service unavailable - RabbitMQ not connected"
            )

        response = await rabbitmq_client.send_to_service(service_name, payload)
        return response["body"]

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Gateway processing error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_config=None,
        access_log=False
    )