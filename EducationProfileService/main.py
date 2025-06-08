from typing import Optional

from fastapi import FastAPI, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from databasePostgres import get_db
from databaseClickHouse import get_db_ClcikHouse
from services import services, clickhouseService
from schemas.Schemas import InstitutiesAddSchema, UserAddSchema, FacultiesAddSchema, StudyGroupAddSchema, \
    UserInfoAddSchema
import configparser

app = FastAPI()

from clickhouse_driver import Client

config = configparser.ConfigParser()
config.read("configs/clickhouseConfig.ini")

def get_clickhouse_conn():
    return Client(
        host=config.get('host'),
        port=config.get('port'),
        user=config.get('user'),
        password=config.get('password'),
        database=config.get('database'),
        settings=config.get('settings')
    )

# Использование:

# Получение всех пользователей
@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    return await services.get_users(db)


# Создание пользователя
@app.post("/users/")
async def create_user(data: UserAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_user(data, db)


# Получение всех институтов
@app.get("/institutes/")
async def get_institutes(db: AsyncSession = Depends(get_db)):
    return await services.get_institutes(db)


# Создание института
@app.post("/institutes/")
async def create_institute(data: InstitutiesAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_institute(data, db)


@app.get("/faculties")
async def get_faculties(db: AsyncSession = Depends(get_db)):
    return await services.get_faculties(db)


@app.post("/faculties")
async def create_faculties(data: FacultiesAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_faculties(data, db)


@app.post("/studyGroup")
async def create_studyGroup(data: StudyGroupAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_studyGroup(data, db)


@app.get("/studyGroup")
async def get_studyGroup(db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup(db)


@app.get("/studyGroup/{group_name}")
async def get_studyGroup(group_name: str, db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup_by_name(db, group_name)


@app.post("/userInfo")
async def create_userInfo(data: UserInfoAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_userInfo(data, db)


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
    return await clickhouseService.get_scheduleTest(db,**filters)

