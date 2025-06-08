from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .database import get_db
from .repositories import WidgetRepository
from .models import Widget, WidgetCreate, WidgetUpdate


router = APIRouter(
    prefix="/pages",
    tags=["pages"],
)

def get_widget_repository(db: Session = Depends(get_db)) -> WidgetRepository:
    return WidgetRepository(db)


@router.post("/", response_model=Widget, status_code=status.HTTP_201_CREATED)
def create_widget(
    widget: WidgetCreate,
    repo: WidgetRepository = Depends(get_widget_repository)
):
    db_widget = repo.create_widget(widget)
    if db_widget is None:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create widget"
        )
    return db_widget

@router.get("/", response_model=List[Widget])
def read_widgets(
    repo: WidgetRepository = Depends(get_widget_repository)
):
    return repo.get_widgets()

@router.get("/{widget_id}", response_model=Widget)
def read_widget(
    widget_id: int,
    repo: WidgetRepository = Depends(get_widget_repository)
):
    db_widget = repo.get_widget_by_id(widget_id)
    if db_widget is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    return db_widget

@router.put("/{widget_id}", response_model=Widget)
def update_widget(
    widget_id: int,
    widget: WidgetUpdate,
    repo: WidgetRepository = Depends(get_widget_repository)
):
    db_widget = repo.update_widget(widget_id, widget)
    if db_widget is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    return db_widget

@router.delete("/{widget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_widget(
    widget_id: int,
    repo: WidgetRepository = Depends(get_widget_repository)
):
    success = repo.delete_widget(widget_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    return {"ok": True}