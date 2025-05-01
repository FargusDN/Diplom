import json
import logging
from contextlib import asynccontextmanager

import aio_pika
import uvicorn
from aio_pika.abc import AbstractIncomingMessage
from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QUEUE_NAME = "orders_queue"

class Settings:
    RABBITMQ_HOST = "localhost"
    RABBITMQ_PORT = 5672
    RABBITMQ_USER = "rmuser"
    RABBITMQ_PASSWORD = "rmpassword"
    RABBITMQ_VHOST = "/"


def getPayload(payload):
    print(payload['path'])
    print(payload['method'])
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    connection = await aio_pika.connect_robust(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        login=settings.RABBITMQ_USER,
        password=settings.RABBITMQ_PASSWORD,
        virtualhost=settings.RABBITMQ_VHOST,
    )
    channel = await connection.channel()
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)

    async def process_message(message: AbstractIncomingMessage):
        async with message.process():
            try:
                payload = json.loads(message.body.decode())
                logger.info(f"Received order request: {payload}")
                getPayload(payload)
                if (payload['path'] == 'health'):
                    response = health_check()

                # Отправка ответа
                await channel.default_exchange.publish(
                    aio_pika.Message(
                        body=json.dumps(response).encode(),
                        correlation_id=message.correlation_id,
                        headers={"status_code": 200},
                        delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                    ),
                    routing_key=message.reply_to,
                )
            except Exception as e:
                logger.error(f"Error processing message: {e}")

    await queue.consume(process_message)
    logger.info("Orders service started and consuming messages")
    yield
    await connection.close()

app = FastAPI(lifespan=lifespan)


def health_check():
    return {"status": "ok"}



uvicorn.run(
        app,
        host="0.0.0.0",
        port=8002,
        log_config=None,
        access_log=False
    )