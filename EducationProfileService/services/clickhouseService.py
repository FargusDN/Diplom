from typing import Dict, Any

from clickhouse_sqlalchemy import select
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from databaseClickHouse import get_db_ClcikHouse



async def build_filtered_query(table: str, fields: list, filters: Dict[str, Any] = None, limit: int = None) -> text:
    """
    Генерирует безопасный параметризованный SQL-запрос

    :param table: Имя таблицы
    :param fields: Список полей для SELECT
    :param filters: Словарь условий WHERE ({"поле": значение})
    :param limit: Ограничение количества строк
    :return: Объект text с параметризованным запросом
    """
    if not filters:
        filters = {}

    # Базовый запрос
    query = f"SELECT {', '.join(fields)} FROM {table}"

    # Добавляем условия WHERE
    where_clauses = []
    params = {}

    for field, value in filters.items():
        if value is None:
            where_clauses.append(f"{field} IS NULL")
        elif isinstance(value, (list, tuple)):
            where_clauses.append(f"{field} IN :{field}")
            params[field] = tuple(value)
        else:
            where_clauses.append(f"{field} = :{field}")
            params[field] = value

    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)

    # Добавляем LIMIT
    if limit:
        query += f" LIMIT {limit}"

    return text(query), params
async def get_scheduleTest(db: AsyncSession = Depends(get_db_ClcikHouse),**filters):

    select_fields = ["class_schedule_id",
                     "start_tm",
                     "end_tm",
                     "schedule_dt",
                     "numbers_week",
                     "group_name",
                     "discipline_name",
                     "class_type_name",
                     "professor_fio",
                     "auditorium"
                     ]
    query, params = await build_filtered_query(
        table="class_schedule",
        fields=select_fields,
        filters=filters
    )

    result = await db.execute(query,params)
    schedules = result.fetchall()

    return [
        {
            "class_schedule_id" : row[0],
            "start_tm": row[1],
            "end_tm":row[2],
            "schedule_dt":row[3],
            "numbers_week":row[4],
            "group_name":row[5],
            "discipline_name":row[6],
            "class_type_name":row[7],
            "professor_fio": row[8],
            "auditorium": row[9]
        }
        for row in schedules
    ]







async def get_tempMarks(login_user,db: AsyncSession = Depends(get_db_ClcikHouse)):
    # Вариант 1: Через text (если не работает ORM)
    params = {"user_filter":login_user}
    query =  text("""
                    SELECT 
                         temp_mark_id,
                         login_user,
                         kourse,
                         semestr,
                         discipline_name,
                         mark_number,
                         mark_name,
                         mark_dt
                    FROM 
                        temp_marks_student
                    WHERE 
                        login_user = :user_filter
                    ORDER BY 
                        mark_dt DESC
                    LIMIT 100
                """)

    result = await db.execute(query,params)
    tempmarks = result.fetchall()

    # Вариант 2: Если всё же хотите использовать модель
    # (но в ClickHouse-SQLAlchemy это работает не всегда стабильно)
    # query = select([TempMarksStudent.login_user, TempMarksStudent.mark_name, TempMarksStudent.mark_number])
    # result = await db.execute(query)
    # tempmarks = result.fetchall()

    return [
        {
            "temp_mark_id" : row[0],
            "login_user": row[1],
            "kourse":row[2],
            "semestr":row[3],
            "discipline_name":row[4],
            "mark_number":row[5],
            "mark_name":row[6],
            "mark_dt":row[7]
        }
        for row in tempmarks
    ]

async def get_tempMarks(db: AsyncSession = Depends(get_db_ClcikHouse)):
    # Вариант 1: Через text (если не работает ORM)
    query =  text("""
                    SELECT 
                         temp_mark_id,
                         login_user,
                         kourse,
                         semestr,
                         discipline_name,
                         mark_number,
                         mark_name,
                         mark_dt
                    FROM 
                        temp_marks_student
                    ORDER BY 
                        mark_dt DESC
                    LIMIT 100
                """)

    result = await db.execute(query)
    tempmarks = result.fetchall()

    # Вариант 2: Если всё же хотите использовать модель
    # (но в ClickHouse-SQLAlchemy это работает не всегда стабильно)
    # query = select([TempMarksStudent.login_user, TempMarksStudent.mark_name, TempMarksStudent.mark_number])
    # result = await db.execute(query)
    # tempmarks = result.fetchall()

    return [
        {
            "temp_mark_id" : row[0],
            "login_user": row[1],
            "kourse":row[2],
            "semestr":row[3],
            "discipline_name":row[4],
            "mark_number":row[5],
            "mark_name":row[6],
            "mark_dt":row[7]
        }
        for row in tempmarks
    ]


async def get_schedule(db: AsyncSession = Depends(get_db_ClcikHouse)):
    # Вариант 1: Через text (если не работает ORM)
    query =  text("""
                    SELECT 
                        class_schedule_id,
                        start_tm,
                        end_tm,
                        schedule_dt,
                        numbers_week,
                        group_name,
                        discipline_name,
                        class_type_name,
                        professor_fio,
                        auditorium
                    FROM 
                        class_schedule
                    ORDER BY
                        numbers_week,schedule_dt,start_tm
                """)

    result = await db.execute(query)
    schedules = result.fetchall()

    return [
        {
            "class_schedule_id" : row[0],
            "start_tm": row[1],
            "end_tm":row[2],
            "schedule_dt":row[3],
            "numbers_week":row[4],
            "group_name":row[5],
            "discipline_name":row[6],
            "class_type_name":row[7],
            "professor_fio": row[8],
            "auditorium": row[9]
        }
        for row in schedules
    ]


