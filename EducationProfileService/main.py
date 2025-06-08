from typing import Optional
import json
import aio_pika
from aio_pika.abc import AbstractRobustConnection, AbstractChannel
from fastapi import FastAPI, Depends, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from databasePostgres import get_db
from databaseClickHouse import get_db_ClcikHouse
from services import services, clickhouseService
from schemas.Schemas import InstitutiesAddSchema, UserAddSchema, FacultiesAddSchema, StudyGroupAddSchema, \
    UserInfoAddSchema, TempMarksAdd
import configparser

app = FastAPI()

# Глобальные переменные для RabbitMQ
rabbit_connection: AbstractRobustConnection = None
rabbit_channel: AbstractChannel = None

# Чтение конфигураций
config = configparser.ConfigParser()
config.read("configs/clickhouseConfig.ini")
rbconfig = configparser.ConfigParser()
rbconfig.read("configs/rabbitmqConfig.ini")

# Настройки RabbitMQ
RABBITMQ_USER = rbconfig.get('rabbitmqConfig', 'user')
RABBITMQ_PASSWORD = rbconfig.get('rabbitmqConfig', 'password')
RABBITMQ_HOST = rbconfig.get('rabbitmqConfig', 'host')
RABBITMQ_PORT = rbconfig.get('rabbitmqConfig', 'port')
RABBITMQ_VHOST = rbconfig.get('rabbitmqConfig', 'vhost')
QUEUE_NAME = "educationProfile_queue"

# URL для подключения к RabbitMQ
RABBITMQ_URL = f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}:{RABBITMQ_PORT}/{RABBITMQ_VHOST}"


async def connect_to_rabbitmq():
    global rabbit_connection, rabbit_channel
    try:
        rabbit_connection = await aio_pika.connect_robust(RABBITMQ_URL)
        rabbit_channel = await rabbit_connection.channel()

        # Объявляем очередь с параметрами
        await rabbit_channel.declare_queue(
            QUEUE_NAME,
            durable=True,
            arguments={"x-message-ttl": 60000}
        )
        print("Подключение к RabbitMQ установлено")
    except Exception as e:
        print(f"Ошибка подключения к RabbitMQ: {e}")
        raise

async def close_rabbitmq_connection():
    if rabbit_connection:
        await rabbit_connection.close()
    print("Соединение с RabbitMQ закрыто")

@app.on_event("startup")
async def startup_event():
    await connect_to_rabbitmq()

@app.on_event("shutdown")
async def shutdown_event():
    await close_rabbitmq_connection()


async def publish_event(event_type: str, event_data: dict):
    if not rabbit_channel:
        print("Соединение с RabbitMQ не установлено")
        return False

    try:
        message = {
            "event_type": event_type,
            "data": event_data,
            "timestamp": str(datetime.datetime.utcnow())
        }

        # Отправляем сообщение
        await rabbit_channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=QUEUE_NAME
        )
        print(f"Событие '{event_type}' отправлено в RabbitMQ")
        return True
    except Exception as e:
        print(f"Ошибка отправки события: {e}")
        return False

# Функция для получения подключения к ClickHouse
def get_clickhouse_conn():
    return Client(
        host=config.get('clickhouse', 'host'),
        port=config.get('clickhouse', 'port'),
        user=config.get('clickhouse', 'user'),
        password=config.get('clickhouse', 'password'),
        database=config.get('clickhouse', 'database'),
        settings={'use_numpy': True}
    )

@app.post("/users/")
async def create_user(
        data: UserAddSchema,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    user = await services.create_user(data, db)
    # Отправка события в фоне
    background_tasks.add_task(
        publish_event,
        "user_created",
        {"id": user.id, "login": user.login}
    )
    return user
@app.post("/institutes/")
async def create_institute(
        data: InstitutiesAddSchema,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    institute = await services.create_institute(data, db)
    background_tasks.add_task(
        publish_event,
        "institute_created",
        {"id": institute.id, "name": institute.name}
    )
    return institute
@app.post("/faculties")
async def create_faculties(
        data: FacultiesAddSchema,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    faculty = await services.create_faculties(data, db)
    background_tasks.add_task(
        publish_event,
        "faculty_created",
        {"id": faculty.id, "name": faculty.name}
    )
    return faculty
@app.post("/studyGroup")
async def create_studyGroup(
        data: StudyGroupAddSchema,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    group = await services.create_studyGroup(data, db)
    background_tasks.add_task(
        publish_event,
        "study_group_created",
        {"id": group.id, "name": group.name}
    )
    return group
@app.post("/userInfo")
async def create_userInfo(
        data: UserInfoAddSchema,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    user_info = await services.create_userInfo(data, db)
    background_tasks.add_task(
        publish_event,
        "user_info_created",
        {"id": user_info.id, "user_id": user_info.login_user}
    )
    return user_info

@app.post("/addTempMarks")
async def addTempMarks(
        data: TempMarksAdd,
        db: AsyncSession = Depends(get_db),
        background_tasks: BackgroundTasks
):
    grade = await clickhouseService.get_tempMarks(data, db)
    background_tasks.add_task(
        publish_event,
        "mark_created",
        {"id": grade.id, "user_id": grade.login_user,"discipline":grade.discipline}
    )
    return grade

@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    return await services.get_users(db)


@app.get("/institutes/")
async def get_institutes(db: AsyncSession = Depends(get_db)):
    return await services.get_institutes(db)


@app.get("/faculties")
async def get_faculties(db: AsyncSession = Depends(get_db)):
    return await services.get_faculties(db)


@app.get("/studyGroup")
async def get_studyGroup(db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup(db)


@app.get("/studyGroup/{group_name}")
async def get_studyGroup(group_name: str, db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup_by_name(db, group_name)


@app.get("/userInfo")
async def get_UserInfo(db: AsyncSession = Depends(get_db)):
    return await services.get_UserInfo(db)


@app.get("/userInfo/{login_user}")
async def get_UserInfo(login_user: str, db: AsyncSession = Depends(get_db)):
    return await services.get_UserInfo(login_user, db)


@app.get("/getTempMarks")
async def get_tempMarks(db: AsyncSession = Depends(get_db_ClcikHouse)):
    return await clickhouseService.get_tempMarks(db)


@app.get("/getTempMarks/{login_user}")
async def get_tempMarks(login_user: str, db: AsyncSession = Depends(get_db_ClcikHouse)):
    return await clickhouseService.get_tempMarks(login_user, db)


@app.get("/getSchedule")
async def get_scheduleTest(
        db: AsyncSession = Depends(get_db_ClcikHouse),
        start_tm: Optional[str] = Query(None),
        end_tm: Optional[str] = Query(None),
        numbers_week: Optional[str] = Query(None),
        group_name: Optional[str] = Query(None)
):
    filters = {}
    if start_tm is not None:
        filters['start_tm'] = start_tm
    if end_tm is not None:
        filters['end_tm'] = end_tm
    if numbers_week is not None:
        filters['numbers_week'] = numbers_week
    if group_name is not None:
        filters['group_name'] = group_name
    return await clickhouseService.get_scheduleTest(db, **filters)

@app.get("/getAttendance")
async def getAttendance(
        db: AsyncSession = Depends(get_db_ClcikHouse),
        stodent_fio: Optional[str] = Query(None),
        group_name: Optional[str] = Query(None),
        discipline_name: Optional[str] = Query(None),
        periodStart: Optional[str] = Query(None),
        periodEnd:  Optional[str] = Query(None)
                           ):
    filters = {}
    if stodent_fio is not None:
        filters['stodent_fio'] = stodent_fio
    if group_name is not None:
        filters['group_name'] = group_name
    if periodStart is not None:
        filters['periodStart'] = periodStart
    if periodEnd is not None:
        filters['periodEnd'] = periodEnd
    if discipline_name is not None:
        filters['discipline_name'] = discipline_name
    return await clickhouseService.getAttendance(db,**filters)
