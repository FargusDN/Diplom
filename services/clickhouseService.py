from clickhouse_sqlalchemy import select
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from databaseClickHouse import get_db_ClcikHouse


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