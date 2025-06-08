from datetime import date
from typing import List

from pydantic import BaseModel
from sqlalchemy import Date

from pydantic import BaseModel, constr, conint, confloat
from datetime import date, datetime, time

class PositionsInVucSchema(BaseModel):
    position_in_vuc_id: int
    position_in_vuc_name: constr(max_length=100) = "Не определено"
    create_dttm: datetime
    change_dttm: datetime | None = None

class RoleInNaryadSchema(BaseModel):
    role_in_naryad_id: int
    role_name_in_naryad: constr(max_length=100) = "Не определено"
    create_dttm: datetime
    change_dttm: datetime | None = None

class VucUsersSchema(BaseModel):
    vuc_user_id: int
    position_in_vuc_id: int
    manager_id: int | None = None
    last_name: str = "Не определено"
    first_name: str = "Не определено"
    middle_name: str = "Не определено"
    birth_dt: date = date(1925, 1, 1)
    signal_ind: constr(max_length=8) = "active"
    create_dttm: datetime
    change_dttm: datetime | None = None
    auto_delete_dt: date

class TempVucUsersInNaryadSchema(BaseModel):
    naryad_id: int
    naryad_dt: date = date.today()
    start_naryad_tm: time
    end_naryad_tm: time
    vuc_user_id: int
    role_in_naryad_id: int
    signal_ind: constr(max_length=8) = "active"
    create_dttm: datetime
    change_dttm: datetime | None = None
    auto_delete_dt: date

class MilitaryInventorySchema(BaseModel):
    id_inventory: int
    name_inventory: constr(max_length=100)
    category_inventory: constr(max_length=50)
    quantity_inventory: conint(ge=0)
    responsible_id: int
    last_dt_check_inventory: date = date.today()
    create_dttm: datetime
    change_dttm: datetime | None = None

class InventoryTransactionsSchema(BaseModel):
    id_inventory_transaction: int
    id_inventory: int
    type_transaction: constr(max_length=20)
    amount: conint(gt=0)
    transaction_date: date = date.today()
    signal_ind: constr(max_length=8) = "active"
    issuer_id: int
    vuc_user_id: int
    create_dttm: datetime
    change_dttm: datetime | None = None

class MilitaryApplicationsSchema(BaseModel):
    id_military_application: int
    signal_ind: constr(max_length=8) = "active"
    student_id: int
    last_name: str = "Не определено"
    first_name: str = "Не определено"
    middle_name: str = "Не определено"
    birth_dt: date = date(1925, 1, 1)
    study_group_name: str = "Не определено"
    application_date: date = date.today()
    status_military_application: constr(max_length=30) = "В процессе"
    create_dttm: datetime
    change_dttm: datetime | None = None

class SelectionProtocolsSchema(BaseModel):
    id_protocol: int
    protocol_date: date = date.today()
    vacancy_count: conint(gt=0)
    min_rank: confloat(ge=0)
    id_military_application: int
    create_dttm: datetime
    change_dttm: datetime | None = None

class PreliminaryResultsSchema(BaseModel):
    id_preliminary_result: int
    id_military_application: int
    medical_status: constr(max_length=50)
    psych_test_score: conint(ge=0, le=100)
    create_dttm: datetime
    change_dttm: datetime | None = None

class MainResultsSchema(BaseModel):
    id_main_result: int
    id_military_application: int
    gpa: confloat(ge=2.0, le=5.0)
    physical_score: conint(ge=0, le=100)
    total_rank: confloat(ge=0)
    create_dttm: datetime
    change_dttm: datetime | None = None

class EnrollmentDecisionsSchema(BaseModel):
    id_enrollment_decision: int
    id_military_application: int
    id_protocol: int
    decision: constr(max_length=20)
    military_card_issued: bool = False
    create_dttm: datetime
    change_dttm: datetime | None = None

class InventoryTransactionsAddSchema(BaseModel):
    id_inventory: int
    type_transaction: str
    amount: int
    transaction_date: date
    issuer_id: int
    vuc_user_id: int