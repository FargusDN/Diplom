from typing import Optional

from fastapi import FastAPI, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from databaseClickHouse import get_db_ClcikHouse
from services import service
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