# app/routers/student.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import User, Student, Subject, Attendance
from app.schemas import AttendanceOut, StudentAttendanceSummary
from app.dependencies import is_student

router = APIRouter()


# ─────────────────────────────────────────
# GET ENROLLED SUBJECTS
# ─────────────────────────────────────────

@router.get("/subjects")
async def get_my_subjects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_student)
):
    # get student record
    result = await db.execute(
        select(Student).where(Student.user_id == current_user.user_id)
    )
    student = result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # get subjects for student's class
    result = await db.execute(
        select(Subject).where(Subject.class_id == student.class_id)
    )
    return result.scalars().all()


# ─────────────────────────────────────────
# VIEW FULL ATTENDANCE (all subjects summary)
# ─────────────────────────────────────────

@router.get("/attendance", response_model=list[StudentAttendanceSummary])
async def get_my_attendance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_student)
):
    # get student record
    result = await db.execute(
        select(Student).where(Student.user_id == current_user.user_id)
    )
    student = result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # get all subjects for student's class
    result = await db.execute(
        select(Subject).where(Subject.class_id == student.class_id)
    )
    subjects = result.scalars().all()

    summary = []

    for subject in subjects:
        # get all attendance records for this student + subject
        result = await db.execute(
            select(Attendance).where(
                Attendance.stu_id == student.stu_id,
                Attendance.sub_id == subject.sub_id
            )
        )
        records = result.scalars().all()

        total   = len(records)
        present = sum(1 for r in records if r.status == "present")
        absent  = total - present
        percentage = round((present / total) * 100, 2) if total > 0 else 0.0

        summary.append(StudentAttendanceSummary(
            subject=subject.sub_name,
            total_classes=total,
            present=present,
            absent=absent,
            percentage=percentage
        ))

    return summary


# ─────────────────────────────────────────
# VIEW ATTENDANCE BY SUBJECT
# ─────────────────────────────────────────

@router.get("/attendance/{sub_id}", response_model=list[AttendanceOut])
async def get_attendance_by_subject(
    sub_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_student)
):
    # get student record
    result = await db.execute(
        select(Student).where(Student.user_id == current_user.user_id)
    )
    student = result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # get attendance records for this student + subject
    result = await db.execute(
        select(Attendance).where(
            Attendance.stu_id == student.stu_id,
            Attendance.sub_id == sub_id
        )
    )
    records = result.scalars().all()

    if not records:
        raise HTTPException(status_code=404, detail="No attendance found for this subject")

    return records