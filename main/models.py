from sqlalchemy import BigInteger, Column, DateTime
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Time, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func, text

Base = declarative_base()
class TimeTable(Base):
    __tablename__ = "class_schedule"
    __table_args__ = {'schema': 'partitions'}
    class_schedule_id = Column(Integer, primary_key=True, autoincrement=True)
    start_tm = Column(Time, nullable=False)
    end_tm = Column(Time)
    schedule_dt = Column(Date, nullable=False)
    numbers_week = Column(String, nullable=False)
    group_id = Column(Integer, ForeignKey('study_group.group_id'))
    discipline_id = Column(Integer, ForeignKey('disciplines.discipline_id'))
    class_type_id = Column(Integer, ForeignKey('class_types.class_type_id'))
    professor_id = Column(Integer, ForeignKey('user_info.user_id'))
    auditorium = Column(String, nullable=False)

    def __iter__(self):
        return ((c.name, getattr(self, c.name)) for c in self.__table__.columns)


class ClassType(Base):
    __tablename__ = 'class_types'
    __table_args__ = {'schema': 'partitions'}

    class_type_id = Column(Integer, primary_key=True, autoincrement=True)
    class_type_name = Column(String, nullable=False, server_default='Не определено')
    create_dttm = Column(TIMESTAMP, nullable=False, server_default=func.now())
    change_dttm = Column(TIMESTAMP)
    def __repr__(self):
        return f"<ClassType(id={self.class_type_id}, name='{self.class_type_name}')>"