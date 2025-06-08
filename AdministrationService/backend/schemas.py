from pydantic import BaseModel
from datetime import datetime
from typing import Optional  # Добавляем импорт


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