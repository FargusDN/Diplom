from pydantic import BaseModel, constr, confloat, conint
from sqlalchemy import Column, Integer, String, Float
from .database import Base


class WidgetBase(BaseModel):
    title: constr(min_length=1, max_length=100)
    type: str
    data_source_url: str | None = None
    position_x: conint(ge=0) = 0
    position_y: conint(ge=0) = 0
    width: conint(ge=1) = 1
    height: conint(ge=1) = 1
    config: dict = {}

class WidgetCreate(WidgetBase):

    pass

class WidgetUpdate(WidgetBase):

    title: constr(min_length=1, max_length=100) | None = None
    type: str | None = None
    data_source_url: str | None = None
    position_x: conint(ge=0) | None = None
    position_y: conint(ge=0) | None = None
    width: conint(ge=1) | None = None
    height: conint(ge=1) | None = None
    config: dict | None = None

class WidgetInDBBase(WidgetBase):
    id: int

    class Config:
        orm_mode = True

class Widget(WidgetInDBBase):
    pass


class WidgetORM(Base):
    __tablename__ = "widgets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    type = Column(String)
    data_source_url = Column(String, nullable=True)
    position_x = Column(Integer)
    position_y = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    config = Column(String) # JSON будет храниться как строка, или используйте JSONB тип если поддерживается

