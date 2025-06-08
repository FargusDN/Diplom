from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    login_user = Column(String, primary_key=True)
    password_user = Column(String, nullable=False)
    role_user = Column(String, nullable=False)

class Institute(Base):
    __tablename__ = 'institutes'
    institute_id = Column(Integer, primary_key=True)
    institute_name = Column(String, nullable=False)

class Faculty(Base):
    __tablename__ = 'faculties'
    faculty_id = Column(Integer, primary_key=True)
    faculty_name = Column(String, nullable=False)
    institute_id = Column(Integer, ForeignKey('institutes.institute_id'))

class StudyGroup(Base):
    __tablename__ = 'study_group'
    group_id = Column(Integer, primary_key=True)
    group_name = Column(String, nullable=False)

class UserInfo(Base):
    __tablename__ = 'user_info'
    user_id = Column(Integer, primary_key=True)
    email = Column(String)
    group_id = Column(Integer, ForeignKey('study_group.group_id'))
    user_status = Column(String, nullable=False)

class NotificationType(Base):
    __tablename__ = 'notification_types'
    type_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)

class Notification(Base):
    __tablename__ = 'notifications'
    notification_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user_info.user_id'))
    type_id = Column(Integer, ForeignKey('notification_types.type_id'))
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

class RequestType(Base):
    __tablename__ = 'request_types'
    request_type_id = Column(Integer, primary_key=True)
    request_type_name = Column(String, nullable=False)

class UserRequest(Base):
    __tablename__ = 'user_requests'
    request_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user_info.user_id'))
    request_type_id = Column(Integer, ForeignKey('request_types.request_type_id'))
    title = Column(String, nullable=False)
    description = Column(String)
    status_request = Column(String, default='pending')
    assigned_to = Column(Integer, ForeignKey('user_info.user_id'))