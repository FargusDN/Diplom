from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    login_user: str
    password_user: Optional[str] = None
    role_user: str = 'simple_user'
    signal_ind: str = 'active'
    privilege_mil_center_ystu: bool = False

class UserResponse(UserCreate):
    create_dttm: datetime
    change_dttm: Optional[datetime] = None
    auto_delete_dt: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserInfoBase(BaseModel):
    login_user: str
    email: Optional[str] = None

    class Config:
        orm_mode = True

class UserInfoResponse(UserInfoBase):
    user_id: int
    create_dttm: datetime
    change_dttm: Optional[datetime] = None

# Новые схемы для микросервиса уведомлений
class NotificationCreate(BaseModel):
    type_id: int
    message: str
    user_ids: Optional[List[int]] = None
    group_ids: Optional[List[int]] = None
    institute_ids: Optional[List[int]] = None

class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    type_id: int
    message: str
    is_read: bool
    create_dttm: datetime

    class Config:
        orm_mode = True

class NotificationTypeResponse(BaseModel):
    type_id: int
    type_name: str
    title: str

    class Config:
        orm_mode = True

class UserRequestCreate(BaseModel):
    user_id: int
    request_type_id: int
    title: str
    description: str

class UserRequestUpdate(BaseModel):
    status_request: str
    assigned_to: Optional[int] = None
    response_rejected: Optional[str] = None

class UserRequestResponse(BaseModel):
    request_id: int
    user_id: int
    request_type_id: int
    title: str
    description: str
    status_request: str
    create_dttm: datetime
    assigned_to: Optional[int] = None
    closed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class RequestTypeResponse(BaseModel):
    request_type_id: int
    request_type_name: str

    class Config:
        orm_mode = True

class InstituteResponse(BaseModel):
    institute_id: int
    institute_name: str

    class Config:
        orm_mode = True

class GroupResponse(BaseModel):
    group_id: int
    group_name: str

    class Config:
        orm_mode = True

class UserSimpleResponse(BaseModel):
    user_id: int
    email: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None

    class Config:
        orm_mode = True