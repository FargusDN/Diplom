from datetime import datetime, date
from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import mapped_column, Mapped, relationship

from databasePostgres import Base


# Модель пользователя
class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'partitions'}
    login_user: Mapped[str] = mapped_column(primary_key=True)
    password_user: Mapped[str] = mapped_column(nullable=False)
    role_user: Mapped[str] = mapped_column(nullable=False, server_default="simple_user")
    info: Mapped["UserInfo"] = relationship()



class Institutes(Base):
    __tablename__ = "institutes"
    __table_args__ = {'schema': 'partitions'}
    institute_id: Mapped[int] = mapped_column(primary_key=True)
    institute_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    faculties: Mapped[List["Faculties"]] = relationship()


class Faculties(Base):
    __tablename__ = "faculties"
    __table_args__ = {'schema': 'partitions'}
    faculty_id: Mapped[int] = mapped_column(primary_key=True)
    faculty_code: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    faculty_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    institute_id: Mapped[int] = mapped_column(ForeignKey("partitions.institutes.institute_id"))
    studyGroup: Mapped[List["StudyGroup"]] = relationship()


class StudyGroup(Base):
    __tablename__ = "study_group"
    __table_args__ = {'schema': 'partitions'}
    group_id: Mapped[int] = mapped_column(primary_key=True)
    group_name: Mapped[str] = mapped_column(nullable=False)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("partitions.faculties.faculty_id"))
    user_info: Mapped["UserInfo"] = relationship()

class UserInfo(Base):
    __tablename__ = "user_info"
    __table_args__ = {'schema': 'partitions'}
    user_id: Mapped[int] = mapped_column(primary_key=True)
    user_status: Mapped[str] = mapped_column(nullable=True,server_default="Студент")
    login_user: Mapped[str] = mapped_column(ForeignKey("partitions.users.login_user"),unique=True)
    last_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    first_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    middle_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    birth_dt: Mapped[date] = mapped_column(nullable=False,server_default="1925-01-01")
    email: Mapped[str] = mapped_column(unique=True)
    number_phone: Mapped[str] = mapped_column(unique=True)
    address_registration: Mapped[str] = mapped_column(nullable=False,server_default="Не определено")
    source_finance: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    form_study: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    group_id: Mapped[str] = mapped_column(ForeignKey("partitions.study_group.group_id"),unique=True)
    qualification: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    add_info: Mapped[str]
    photo_user: Mapped[str]
