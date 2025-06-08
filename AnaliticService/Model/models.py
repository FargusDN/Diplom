from pydantic import BaseModel
from typing import List, Dict

class SubjectGrade(BaseModel):
    subject: str
    grade: float

class SubjectAttendance(BaseModel):
    subject: str
    attended: int
    total: int

class StudentGrades(BaseModel):
    student_id: int
    grades: List[SubjectGrade]

class StudentAttendance(BaseModel):
    student_id: int
    attendance: List[SubjectAttendance]