from datetime import datetime, date
from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from databasePostgres import Base
# Таблица "PositionsInVUC"
class PositionsInVUC(Base):
    __tablename__ = "positions_in_vuc"
    __table_args__ = {'schema': 'public'}
    position_in_vuc_id: Mapped[int] = mapped_column(primary_key=True)
    position_in_vuc_name: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
# Таблица "RoleInNaryad"
class RoleInNaryad(Base):
    __tablename__ = "role_in_naryad"
    __table_args__ = {'schema': 'public'}
    role_in_naryad_id: Mapped[int] = mapped_column(primary_key=True)
    role_name_in_naryad: Mapped[str] = mapped_column(nullable=False, server_default="Не определено")
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    @staticmethod
    def validate_role_name_in_naryad(value: str):
        allowed_roles = ['Дежурный', 'Помощник', 'Дневальный']
        if value not in allowed_roles:
            raise ValueError(f"role_name_in_naryad must be one of {allowed_roles}")
# Таблица "VUCUsers"
class VUCUsers(Base):
    __tablename__ = "vuc_users"
    __table_args__ = {'schema': 'public'}
    vuc_user_id: Mapped[int] = mapped_column(primary_key=True)
    position_in_vuc_id: Mapped[int] = mapped_column(ForeignKey("public.positions_in_vuc.position_in_vuc_id"), nullable=False)
    manager_id: Mapped[int] = mapped_column(ForeignKey("public.vuc_users.vuc_user_id"), nullable=True)
    last_name: Mapped[str] = mapped_column(server_default="Не определено")
    first_name: Mapped[str] = mapped_column(server_default="Не определено")
    middle_name: Mapped[str] = mapped_column(server_default="Не определено")
    birth_dt: Mapped[date] = mapped_column(server_default="1925-01-01")
    signal_ind: Mapped[str] = mapped_column(nullable=False, server_default="active")
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    auto_delete_dt: Mapped[date] = mapped_column(default=(datetime.now().date()), nullable=False)
    manager: Mapped["VUCUsers"] = relationship("VUCUsers", remote_side=[vuc_user_id])
# Таблица "MilitaryInventory"
class MilitaryInventory(Base):
    __tablename__ = "military_inventory"
    __table_args__ = {'schema': 'public'}
    id_inventory: Mapped[int] = mapped_column(primary_key=True)
    name_inventory: Mapped[str] = mapped_column(nullable=False, unique=True)
    category_inventory: Mapped[str] = mapped_column(nullable=False)
    quantity_inventory: Mapped[int] = mapped_column(nullable=False)
    responsible_id: Mapped[int] = mapped_column(ForeignKey("public.vuc_users.vuc_user_id"), nullable=False)
    last_dt_check_inventory: Mapped[date] = mapped_column(default=datetime.now().date(), nullable=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
# Таблица "InventoryTransactions"
class InventoryTransactions(Base):
    __tablename__ = "inventory_transactions"
    __table_args__ = {'schema': 'public'}
    id_inventory_transaction: Mapped[int] = mapped_column(primary_key=True)
    id_inventory: Mapped[int] = mapped_column(ForeignKey("public.military_inventory.id_inventory"), nullable=False)
    type_transaction: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    transaction_date: Mapped[date] = mapped_column(default=datetime.now().date(), nullable=False)
    signal_ind: Mapped[str] = mapped_column(nullable=False, server_default="active")
    issuer_id: Mapped[int] = mapped_column(ForeignKey("public.vuc_users.vuc_user_id"), nullable=False)
    vuc_user_id: Mapped[int] = mapped_column(ForeignKey("public.vuc_users.vuc_user_id"), nullable=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
# Таблица "MilitaryApplications"
class MilitaryApplications(Base):
    __tablename__ = "military_applications"
    __table_args__ = {'schema': 'public'}
    id_military_application: Mapped[int] = mapped_column(primary_key=True)
    signal_ind: Mapped[str] = mapped_column(nullable=False, server_default="active")
    student_id: Mapped[int] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(server_default="Не определено")
    first_name: Mapped[str] = mapped_column(server_default="Не определено")
    middle_name: Mapped[str] = mapped_column(server_default="Не определено")
    birth_dt: Mapped[date] = mapped_column(server_default="1925-01-01")
    study_group_name: Mapped[str] = mapped_column(server_default="Не определено")
    application_date: Mapped[date] = mapped_column(default=datetime.now().date())
    status_military_application: Mapped[str] = mapped_column(server_default="В процессе")
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)

class SelectionProtocols(Base):
    __tablename__ = "selection_protocols"
    __table_args__ = {'schema': 'public'}
    id_protocol: Mapped[int] = mapped_column(primary_key=True)
    protocol_date: Mapped[date] = mapped_column(default=datetime.now().date())
    vacancy_count: Mapped[int] = mapped_column(nullable=False)
    min_rank: Mapped[float] = mapped_column(nullable=False)
    id_military_application: Mapped[int] = mapped_column(
        ForeignKey("public.military_applications.id_military_application"), nullable=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    # Relationship (если нужно)
    military_application: Mapped["MilitaryApplications"] = relationship(back_populates="selection_protocols")

# Таблица "PreliminaryResults"
class PreliminaryResults(Base):
    __tablename__ = "preliminary_results"
    __table_args__ = {'schema': 'public'}
    id_preliminary_result: Mapped[int] = mapped_column(primary_key=True)
    id_military_application: Mapped[int] = mapped_column(
        ForeignKey("public.military_applications.id_military_application"), nullable=False)
    medical_status: Mapped[str] = mapped_column(nullable=False)
    psych_test_score: Mapped[int] = mapped_column(nullable=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    # Relationship (если нужно)
    military_application: Mapped["MilitaryApplications"] = relationship(back_populates="preliminary_results")

# Таблица "MainResults"
class MainResults(Base):
    __tablename__ = "main_results"
    __table_args__ = {'schema': 'public'}
    id_main_result: Mapped[int] = mapped_column(primary_key=True)
    id_military_application: Mapped[int] = mapped_column(
        ForeignKey("public.military_applications.id_military_application"), nullable=False)
    gpa: Mapped[float] = mapped_column(nullable=False)
    physical_score: Mapped[int] = mapped_column(nullable=False)
    total_rank: Mapped[float] = mapped_column(nullable=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    # Relationship (если нужно)
    military_application: Mapped["MilitaryApplications"] = relationship(back_populates="main_results")

# Таблица "EnrollmentDecisions"
class EnrollmentDecisions(Base):
    __tablename__ = "enrollment_decisions"
    __table_args__ = {'schema': 'public'}
    id_enrollment_decision: Mapped[int] = mapped_column(primary_key=True)
    id_military_application: Mapped[int] = mapped_column(
        ForeignKey("public.military_applications.id_military_application"), nullable=False)
    id_protocol: Mapped[int] = mapped_column(ForeignKey("public.selection_protocols.id_protocol"), nullable=False)
    decision: Mapped[str] = mapped_column(nullable=False)
    military_card_issued: Mapped[bool] = mapped_column(default=False)
    create_dttm: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
    change_dttm: Mapped[datetime] = mapped_column(nullable=True)
    # Relationships (если нужно)
    protocol: Mapped["SelectionProtocols"] = relationship(back_populates="enrollment_decisions")
    military_application: Mapped["MilitaryApplications"] = relationship(back_populates="enrollment_decisions")