from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText
import logging
import os
import json
import aio_pika
import asyncio
from contextlib import asynccontextmanager
from .database import get_db, Base
from . import models
from sqlalchemy import select, or_
from .schemas import (
    NotificationCreate,
    NotificationResponse,
    UserRequestCreate,
    UserRequestUpdate,
    UserRequestResponse,
    InstituteResponse,
    GroupResponse,
    RequestTypeResponse,
    UserSimpleResponse
)

# Настройка логгера
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Глобальные переменные для RabbitMQ
rabbit_connection = None
rabbit_channel = None
QUEUE_NAME = "notifications_queue"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения (RabbitMQ подключение)"""
    global rabbit_connection, rabbit_channel

    # Подключение к RabbitMQ при запуске
    try:
        rabbit_connection = await aio_pika.connect_robust(
            host=os.getenv("RABBITMQ_HOST", "localhost"),
            port=int(os.getenv("RABBITMQ_PORT", 5672)),
            login=os.getenv("RABBITMQ_USER", "guest"),
            password=os.getenv("RABBITMQ_PASSWORD", "guest"),
            virtualhost=os.getenv("RABBITMQ_VHOST", "/")
        )
        rabbit_channel = await rabbit_connection.channel()

        # Объявляем очередь
        await rabbit_channel.declare_queue(
            QUEUE_NAME,
            durable=True,
            arguments={
                "x-message-ttl": 60000,
                "x-max-length": 10000
            }
        )
        logger.info("✅ Подключено к RabbitMQ")
    except Exception as e:
        logger.error(f"❌ Ошибка подключения к RabbitMQ: {e}")
        rabbit_connection = None
        rabbit_channel = None

    yield

    # Закрытие соединения при остановке
    if rabbit_connection:
        await rabbit_connection.close()
        logger.info("🔌 Соединение с RabbitMQ закрыто")


app = FastAPI(lifespan=lifespan)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Модели Pydantic
class NotificationCreate(BaseModel):
    type_id: int
    message: str
    user_ids: Optional[List[int]] = None
    group_ids: Optional[List[int]] = None
    institute_ids: Optional[List[int]] = None


class UserRequestCreate(BaseModel):
    user_id: int
    request_type_id: int
    title: str
    description: str


class UserRequestUpdate(BaseModel):
    status_request: str
    assigned_to: Optional[int] = None


# Функция отправки email (адаптированная)
def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        smtp_server = "smtp.yandex.ru"
        smtp_port = 465
        smtp_user = "ystu.iss@yandex.ru"
        smtp_password = os.getenv("SMTP_PASSWORD", "slgxjyrszhoyfqmd")

        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = to_email

        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [to_email], msg.as_string())
        return True
    except Exception as e:
        logging.error(f"SMTP error: {str(e)}")
        return False


async def publish_event(event_type: str, data: dict):
    """Публикация события в RabbitMQ"""
    if not rabbit_channel:
        logger.warning("⚠️ Соединение с RabbitMQ не установлено, событие не отправлено")
        return False

    try:
        message = {
            "event_type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }

        await rabbit_channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=QUEUE_NAME
        )
        logger.info(f"📤 Событие '{event_type}' отправлено в RabbitMQ")
        return True
    except Exception as e:
        logger.error(f"🚨 Ошибка отправки сообщения: {e}")
        return False


# API Endpoints
@app.post("/notifications/", response_model=dict)
async def create_notification(
        notification: NotificationCreate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db)
):
    # Поиск пользователей по критериям
    query = select(models.UserInfo)

    if notification.user_ids:
        query = query.where(models.UserInfo.user_id.in_(notification.user_ids))
    elif notification.group_ids:
        query = query.where(models.UserInfo.group_id.in_(notification.group_ids))
    elif notification.institute_ids:
        # Сложный запрос для институтов через группы и факультеты
        subquery = (
            select(models.StudyGroup.group_id)
            .join(models.Faculty)
            .where(models.Faculty.institute_id.in_(notification.institute_ids))
            .subquery()
        )
        query = query.where(models.UserInfo.group_id.in_(subquery))
    else:
        raise HTTPException(status_code=400, detail="Не указаны получатели")

    recipients = db.execute(query).scalars().all()

    # Создание уведомлений
    notification_type = db.get(models.NotificationType, notification.type_id)
    if not notification_type:
        raise HTTPException(status_code=404, detail="Тип уведомления не найден")

    recipient_ids = []
    for recipient in recipients:
        db_notification = models.Notification(
            user_id=recipient.user_id,
            type_id=notification.type_id,
            message=notification.message
        )
        db.add(db_notification)
        recipient_ids.append(recipient.user_id)

        # Отправка email если есть адрес
        if recipient.email:
            send_email(
                to_email=recipient.email,
                subject=notification_type.title,
                body=notification.message
            )

    db.commit()

    # Отправка события в фоне
    background_tasks.add_task(
        publish_event,
        "notification_created",
        {
            "type_id": notification.type_id,
            "message": notification.message,
            "recipient_count": len(recipients),
            "recipient_ids": recipient_ids
        }
    )

    return {"message": f"Уведомления созданы для {len(recipients)} пользователей"}


@app.get("/users/", response_model=List[UserSimpleResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.execute(select(models.UserInfo)).scalars().all()
    return users


@app.get("/groups/", response_model=List[GroupResponse])
async def get_groups(db: Session = Depends(get_db)):
    groups = db.execute(select(models.StudyGroup)).scalars().all()
    return [{"group_id": g.group_id, "group_name": g.group_name} for g in groups]


@app.get("/institutes/", response_model=List[InstituteResponse])
async def get_institutes(db: Session = Depends(get_db)):
    institutes = db.execute(select(models.Institute)).scalars().all()
    return [{"institute_id": i.institute_id, "institute_name": i.institute_name} for i in institutes]


@app.get("/request-types/", response_model=List[RequestTypeResponse])
async def get_request_types(db: Session = Depends(get_db)):
    types = db.execute(select(models.RequestType)).scalars().all()
    return [{"request_type_id": t.request_type_id, "request_type_name": t.request_type_name} for t in types]


@app.post("/requests/", response_model=UserRequestResponse)
async def create_request(
        request: UserRequestCreate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db)
):
    db_request = models.UserRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)

    # Отправка события в фоне
    background_tasks.add_task(
        publish_event,
        "request_created",
        {
            "request_id": db_request.request_id,
            "user_id": db_request.user_id,
            "request_type_id": db_request.request_type_id,
            "title": db_request.title
        }
    )

    return db_request


@app.patch("/requests/{request_id}", response_model=UserRequestResponse)
async def update_request(
        request_id: int,
        update: UserRequestUpdate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db)
):
    request = db.get(models.UserRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    old_status = request.status_request
    request.status_request = update.status_request
    if update.assigned_to:
        request.assigned_to = update.assigned_to

    db.commit()

    # Отправка события в фоне
    background_tasks.add_task(
        publish_event,
        "request_updated",
        {
            "request_id": request_id,
            "old_status": old_status,
            "new_status": update.status_request,
            "assigned_to": update.assigned_to
        }
    )

    return request


@app.get("/requests/", response_model=List[UserRequestResponse])
async def get_requests(db: Session = Depends(get_db)):
    requests = db.execute(select(models.UserRequest)).scalars().all()
    return requests