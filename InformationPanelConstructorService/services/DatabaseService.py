from datetime import datetime
from jose import jwt
from app.repositories.user_repository import UserRepository
from app.core.config import settings


class WidgetBase(BaseModel):
    title: constr(min_length=1, max_length=100)
    type: str
    data_source_url: Optional[str] = None
    position_x: conint(ge=0) = 0
    position_y: conint(ge=0) = 0
    width: conint(ge=1) = 1
    height: conint(ge=1) = 1
    config: Dict[str, Any] = {}
class WidgetCreate(WidgetBase):
    pass
class WidgetUpdate(WidgetBase):
    title: Optional[constr(min_length=1, max_length=100)] = None
    type: Optional[str] = None
    data_source_url: Optional[str] = None
    position_x: Optional[conint(ge=0)] = None
    position_y: Optional[conint(ge=0)] = None
    width: Optional[conint(ge=1)] = None
    height: Optional[conint(ge=1)] = None
    config: Optional[Dict[str, Any]] = None
def get_widget_repository(db: SessionLocal = Depends(get_db)) -> WidgetRepository:
    return WidgetRepository(db)
def read_widgets_endpoint(
    repo: WidgetRepository = Depends(get_widget_repository)
):
    return repo.get_widgets()

def read_widget_endpoint(
    widget_id: int,
    repo: WidgetRepository = Depends(get_widget_repository)
):
    db_widget = repo.get_widget_by_id(widget_id)
    if db_widget is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    return db_widget