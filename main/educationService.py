from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import TimeTable, ClassType
from dbconnection import DBCONNECTION

class SheduleService:
    dbcon = DBCONNECTION()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=dbcon.engine)
    def get_all_schedules(self):
        # Создаем новую сессию для каждого запроса
        db = self.SessionLocal()
        try:
            return (db.query(TimeTable,ClassType)
                    .join(ClassType,TimeTable.class_type_id == ClassType.class_type_id)
                    .all())
        finally:
            # Важно закрывать сессию после использования
            db.close()
    # Теперь правильно используем функцию