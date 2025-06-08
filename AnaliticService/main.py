from asyncio.log import logger
from typing import Optional

from fastapi import FastAPI, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from databaseClickHouse import get_db_ClcikHouse
from services import service
import configparser
import aio_pika
import uvicorn
from aio_pika.abc import AbstractIncomingMessage
import json
import logging
app = FastAPI()

from clickhouse_driver import Client

config = configparser.ConfigParser()
config.read("configs/clickhouseConfig.ini")
rbconfig = configparser.ConfigParser()
rbconfig.read("configs/rabbitmqConfig.ini")
class Settings:
    RABBITMQ_HOST = rbconfig.host
    RABBITMQ_PORT = rbconfig.port
    RABBITMQ_USER = rbconfig.user
    RABBITMQ_PASSWORD = rbconfig.password
    RABBITMQ_VHOST = rbconfig.vhost

class CLSettings:
    CLICKHOUSE_HOST = config.get('host')
    CLICKHOUSE_PORT = config.get('port')
    CLICKHOUSE_USER = config.get('user')
    CLICKHOUSE_PASSWORD = config.get('password')
    CLICKHOUSE_DATABASE = config.get('database')
    CLICKHOUSE_SETTINGS = config.get('settings')
def get_clickhouse_conn():
    clsettings = CLSettings()
    return Client(
        host=clsettings.CLICKHOUSE_HOST,
        port=clsettings.CLICKHOUSE_PORT,
        user=clsettings.CLICKHOUSE_USER,
        password=clsettings.CLICKHOUSE_PASSWORD,
        database=clsettings.CLICKHOUSE_DATABASE,
        settings=clsettings.CLICKHOUSE_SETTINGS,
    )
async def get_rabbit_conn():
    settings = Settings()
    connection = await aio_pika.connect_robust(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        login=settings.RABBITMQ_USER,
        password=settings.RABBITMQ_PASSWORD,
        virtualhost=settings.RABBITMQ_VHOST,
    )


@app.get("/getTempMarks")
async def getTempMarks(
        db: AsyncSession = Depends(get_db_ClcikHouse),
        login_user: Optional[str] = Query(None),
        group_name: Optional[str] = Query(None),
        discipline: Optional[str] = Query(None),
        periodStart: Optional[str] = Query(None),
        periodEnd: Optional[str] = Query(None)
                           ):
    filters = {}
    if login_user is not None:
        filters['login_user'] = login_user
    if group_name is not None:
        filters['group_name'] = group_name
    if periodStart is not None:
        filters['periodStart'] = periodStart
    if periodEnd is not None:
        filters['periodEnd'] = periodEnd
    if discipline is not None:
        filters['discipline'] = discipline
    return await service.getAvgTempMarks(db, **filters)

@app.get("/getAvgTempMarks")
async def getTempMarks(
        db: AsyncSession = Depends(get_db_ClcikHouse),
        login_user: Optional[str] = Query(None),
        group_name: Optional[str] = Query(None),
        discipline: Optional[str] = Query(None),
        periodStart: Optional[str] = Query(None),
        periodEnd:  Optional[str] = Query(None)
                           ):
    filters = {}
    if login_user is not None:
        filters['login_user'] = login_user
    if group_name is not None:
        filters['group_name'] = group_name
    if periodStart is not None:
        filters['periodStart'] = periodStart
    if periodEnd is not None:
        filters['periodEnd'] = periodEnd
    if discipline is not None:
        filters['discipline'] = discipline
    return await service.getAvgTempMarks(db,**filters)

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
    return await service.getAttendance(db,**filters)

@app.get("/getAvgAttendance")
async def getAvgAttendance(
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
    return await service.getAvgAttendance(db,**filters)