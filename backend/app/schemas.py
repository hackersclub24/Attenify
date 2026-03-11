# app/schemas.py
from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import date
from typing import Optional


# --- Enums ---
class RoleEnum(str, Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class StatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"

class AttendanceStatusEnum(str, Enum):
    present = "present"
    absent = "absent"


# ─────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleEnum


# ─────────────────────────────────────────
# USER
# ─────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    password: str
    role: RoleEnum
    email: EmailStr
    status: StatusEnum = StatusEnum.active

class UserOut(BaseModel):
    user_id: int
    username: str
    role: RoleEnum
    email: EmailStr
    status: StatusEnum

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# ADMIN
# ─────────────────────────────────────────

class AdminCreate(BaseModel):
    user_id: int
    admin_level: str

class AdminOut(BaseModel):
    admin_id: int
    admin_level: str
    user: UserOut

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# TEACHER
# ─────────────────────────────────────────

class TeacherCreate(BaseModel):
    user_id: int
    dept: str

class TeacherOut(BaseModel):
    teacher_id: int
    dept: str
    user: UserOut

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# STUDENT
# ─────────────────────────────────────────

class StudentCreate(BaseModel):
    user_id: int
    roll_no: str
    class_id: int

class StudentOut(BaseModel):
    stu_id: int
    roll_no: str
    user: UserOut

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# CLASS
# ─────────────────────────────────────────

class ClassCreate(BaseModel):
    class_name: str
    section: str

class ClassOut(BaseModel):
    class_id: int
    class_name: str
    section: str

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# SUBJECT
# ─────────────────────────────────────────

class SubjectCreate(BaseModel):
    sub_name: str
    teacher_id: int
    class_id: int

class SubjectOut(BaseModel):
    sub_id: int
    sub_name: str
    teacher_id: int
    class_id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# ATTENDANCE
# ─────────────────────────────────────────

class AttendanceRecord(BaseModel):
    stu_id: int
    status: AttendanceStatusEnum

class AttendanceCreate(BaseModel):
    sub_id: int
    date: date
    records: list[AttendanceRecord]  # bulk mark for whole class

class AttendanceOut(BaseModel):
    atten_id: int
    stu_id: int
    sub_id: int
    date: date
    status: AttendanceStatusEnum

    class Config:
        from_attributes = True

class StudentAttendanceSummary(BaseModel):
    subject: str
    total_classes: int
    present: int
    absent: int
    percentage: float