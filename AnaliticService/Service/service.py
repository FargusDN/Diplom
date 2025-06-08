from typing import Dict, Any
from clickhouse_sqlalchemy import select
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from databaseClickHouse import get_db_ClcikHouse


db = get_db_ClcikHouse

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
async def get_tempMarks(login_user,db: AsyncSession = Depends(get_db_ClcikHouse)):
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

async def get_tempMarks(group_id,db: AsyncSession = Depends(get_db_ClcikHouse)):
    params = {"user_filter":group_id}
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
                        group_id = :user_filter
                    ORDER BY 
                        mark_dt DESC
                    LIMIT 100
                """)

    result = await db.execute(query,params)
    tempmarks = result.fetchall()

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


    return [
        {
            "mark_number":row[5],
        }
        for row in tempmarks
    ]

async def getTempMarks(db: AsyncSession = Depends(get_db_ClcikHouse),**filters):

    select_fields = ["mark_number",
                     "mark_dt",
                     "discipline_name"
                     ]
    query, params = await build_filtered_query(
        table="temp_marks_student",
        fields=select_fields,
        filters=filters
    )

    result = await db.execute(query,params)
    tempMarks = result.fetchall()

    return [
        {
            "mark_number" : row[0],
            "mark_dt": row[1],
            "discipline_name":row[2]
        }
        for row in tempMarks
    ]

async def getAttendance(db: AsyncSession = Depends(get_db_ClcikHouse),**filters):

    select_fields = ["attendence_bool",
                     "group_name",
                     "discipline_name",
                     "student_fio"
                     ]
    query, params = await build_filtered_query(
        table="attendance_students",
        fields=select_fields,
        filters=filters
    )

    result = await db.execute(query,params)
    attendance = result.fetchall()

    return [
        {
            "attendence_bool": row[0],
            "group_name": row[1],
            "discipline_name": row[2],
            "student_fio": row[3]
        }
        for row in attendance
    ]

async def getAvgTempMarks(db: AsyncSession = Depends(get_db_ClcikHouse),**filters):

    select_fields = ["mark_number",
                     "mark_dt",
                     "discipline_name"
                     ]
    query, params = await build_filtered_query(
        table="temp_marks_student",
        fields=select_fields,
        filters=filters
    )

    result = await db.execute(query,params)
    tempMarks = result.fetchall()

    grades = [
        {
            "mark_number" : row[0],
            "mark_dt": row[1],
            "discipline_name":row[2]
        }
        for row in tempMarks
    ]
    if not grades:
        return 0
    return sum(grades) / len(grades)


async def getAvgAttendance(db: AsyncSession = Depends(get_db_ClcikHouse),**filters):

    select_fields = ["attendence_bool",
                     "group_name",
                     "discipline_name",
                     "student_fio"
                     ]
    query, params = await build_filtered_query(
        table="attendance_students",
        fields=select_fields,
        filters=filters
    )

    result = await db.execute(query,params)
    attendance = result.fetchall()

    attendance = [
        {
            "attendence_bool": row[0],
            "group_name": row[1],
            "discipline_name": row[2],
            "student_fio": row[3]
        }
        for row in attendance
    ]
    allAttendence = 0
    studentAtt = 0
    if not attendance:
        return 0
    for att in attendance:
        allAttendence+=1
        if att[0]:
            studentAtt+=1
    return studentAtt / allAttendence * 100
