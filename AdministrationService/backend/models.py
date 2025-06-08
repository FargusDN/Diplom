from sqlalchemy import Column, String, Boolean, DateTime, text, Integer, ForeignKey, BigInteger, Date, Text
from database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'public'}  # Явно указываем схему

    login_user = Column(String, primary_key=True, index=True)
    password_user = Column(String, nullable=False)
    role_user = Column(String, nullable=False, server_default=text("'simple_user'"))
    signal_ind = Column(String(8), nullable=False, server_default=text("'active'"))
    privilege_mil_center_ystu = Column(Boolean, nullable=False, server_default=text("false"))
    create_dttm = Column(DateTime, nullable=False, server_default=text("now()"))
    change_dttm = Column(DateTime)
    auto_delete_dt = Column(DateTime, server_default=text("(NOW() + INTERVAL '4 years 3 months')"))


class UserInfo(Base):
    __tablename__ = "user_info"
    __table_args__ = {'schema': 'public'}

    user_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_status = Column(String, nullable=False, server_default=text("'Студент'"))
    login_user = Column(String, ForeignKey('public.users.login_user', ondelete='CASCADE'), unique=True)
    last_name = Column(String, server_default=text("'Не определено'"))
    first_name = Column(String, server_default=text("'Не определено'"))
    middle_name = Column(String, server_default=text("'Не определено'"))
    birth_dt = Column(Date, server_default=text("'1925-01-01'::date"))
    email = Column(String, unique=True)
    number_phone = Column(String, unique=True)
    address_registration = Column(String, server_default=text("'Не определено'"))
    source_finance = Column(String, server_default=text("'Не определено'"))
    form_study = Column(String, server_default=text("'Не определено'"))
    group_id = Column(Integer, ForeignKey('public.study_group.group_id'))
    qualification = Column(String, server_default=text("'Не определено'"))
    add_info = Column(Text)
    photo_user = Column(Text)
    create_dttm = Column(DateTime, nullable=False, server_default=text("now()"))
    change_dttm = Column(DateTime)