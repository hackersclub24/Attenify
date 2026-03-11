# app/models.py
from sqlalchemy import Column, Integer, String, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
import enum

# --- Enums ---
class RoleEnum(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class StatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class AttendanceStatusEnum(str, enum.Enum):
    present = "present"
    absent = "absent"


# --- Tables ---

class User(Base):
    __tablename__ = "users"

    user_id  = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # will store hashed
    role     = Column(Enum(RoleEnum), nullable=False)
    email    = Column(String(100), unique=True, nullable=False)
    status   = Column(Enum(StatusEnum), default="active", nullable=False)

    # relationships
    admin   = relationship("Admin",   back_populates="user", uselist=False)
    teacher = relationship("Teacher", back_populates="user", uselist=False)
    student = relationship("Student", back_populates="user", uselist=False)


class Admin(Base):
    __tablename__ = "admins"

    admin_id    = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    admin_level = Column(String(30), nullable=False)

    user = relationship("User", back_populates="admin")


class Teacher(Base):
    __tablename__ = "teachers"

    teacher_id = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    dept       = Column(String(30), nullable=False)

    user     = relationship("User", back_populates="teacher")
    subjects = relationship("Subject", back_populates="teacher")


class Student(Base):
    __tablename__ = "students"

    stu_id   = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    roll_no  = Column(String(30), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)

    user       = relationship("User", back_populates="student")
    cls        = relationship("Class", back_populates="students")
    attendance = relationship("Attendance", back_populates="student")


class Class(Base):
    __tablename__ = "classes"

    class_id   = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(20), nullable=False)
    section    = Column(String(10), nullable=False)

    students = relationship("Student", back_populates="cls")
    subjects = relationship("Subject", back_populates="cls")


class Subject(Base):
    __tablename__ = "subjects"

    sub_id     = Column(Integer, primary_key=True, index=True)
    sub_name   = Column(String(30), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.teacher_id"), nullable=False)
    class_id   = Column(Integer, ForeignKey("classes.class_id"), nullable=False)

    teacher    = relationship("Teacher", back_populates="subjects")
    cls        = relationship("Class", back_populates="subjects")
    attendance = relationship("Attendance", back_populates="subject")


class Attendance(Base):
    __tablename__ = "attendance"

    atten_id = Column(Integer, primary_key=True, index=True)
    stu_id   = Column(Integer, ForeignKey("students.stu_id"), nullable=False)
    sub_id   = Column(Integer, ForeignKey("subjects.sub_id"), nullable=False)
    date     = Column(Date, nullable=False)
    status   = Column(Enum(AttendanceStatusEnum), nullable=False)

    student = relationship("Student", back_populates="attendance")
    subject = relationship("Subject", back_populates="attendance")