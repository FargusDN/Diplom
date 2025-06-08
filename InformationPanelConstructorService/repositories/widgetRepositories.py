from sqlalchemy.orm import Session
from typing import List, Dict, Any


from .models import WidgetORM



class WidgetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_widget_orm(self, widget: WidgetCreate) -> WidgetORM:
        db_widget = WidgetORM(**widget.model_dump())
        self.db.add(db_widget)
        self.db.commit()
        self.db.refresh(db_widget)
        return db_widget

    def get_widgets_orm(self) -> List[WidgetORM]:
        return self.db.query(WidgetORM).all()

    def get_widget_by_id_orm(self, widget_id: int) -> WidgetORM | None:
        return self.db.query(WidgetORM).filter(WidgetORM.id == widget_id).first()

    def update_widget_orm(self, widget_id: int, widget: WidgetUpdate) -> WidgetORM | None:
        db_widget = self.get_widget_by_id_orm(widget_id)
        if db_widget:
            update_data = widget.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_widget, key, value)
            self.db.commit()
            self.db.refresh(db_widget)
            return db_widget
        return None

    def delete_widget_orm(self, widget_id: int) -> bool:
        db_widget = self.get_widget_by_id_orm(widget_id)
        if db_widget:
            self.db.delete(db_widget)
            self.db.commit()
            return True
        return False