from datetime import date
from typing import List

from pydantic import BaseModel
from sqlalchemy import Date


class UserAddSchema(BaseModel):
    login_user: str
    password_user: str
class UserGetSchema(UserAddSchema):
    pass

class InstitutiesAddSchema(BaseModel):
    institute_name: str

class InstitutiesGetSchema(InstitutiesAddSchema):
    institute_id: int

class FacultiesAddSchema(BaseModel):
    faculty_code: str
    faculty_name: str
    institute_id: int

class StudyGroupAddSchema(BaseModel):
    group_name: str
    faculty_id: int

class UserInfoAddSchema(BaseModel):
    user_status: str
    login_user: str
    last_name: str
    first_name: str
    middle_name: str
    birth_dt: date
    email: str
    number_phone: str
    address_registration: str
    source_finance: str
    form_study: str
    group_id: int
    qualification: str
    add_info: str
    photo_user: str


class Mark(BaseModel):
    mark: int
class TempMarksAdd(BaseModel):
    last_name: str
    first_name: str
    middle_name: str
    discipline: str
    List[Mark]: int
