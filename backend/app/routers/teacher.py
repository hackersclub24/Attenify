# app/routers/teacher.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import User, Teacher, Subject, Student, Attendance
from app.schemas import AttendanceCreate, AttendanceOut
from app.dependencies import is_teacher, get_current_user

router = APIRouter()


# ─────────────────────────────────────────
# GET ASSIGNED SUBJECTS
# ─────────────────────────────────────────

@router.get("/subjects")
async def get_my_subjects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_teacher)
):
    # get teacher record from current user
    result = await db.execute(
        select(Teacher).where(Teacher.user_id == current_user.user_id)
    )
    teacher = result.scalar_one_or_none()

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")

    # get subjects assigned to this teacher
    result = await db.execute(
        select(Subject).where(Subject.teacher_id == teacher.teacher_id)
    )
    subjects = result.scalars().all()
    return subjects


# ─────────────────────────────────────────
# GET STUDENTS FOR A SUBJECT
# ─────────────────────────────────────────

@router.get("/subjects/{sub_id}/students")
async def get_students_for_subject(
    sub_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_teacher)
):
    # verify subject exists
    result = await db.execute(select(Subject).where(Subject.sub_id == sub_id))
    subject = result.scalar_one_or_none()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # get all students in that subject's class and join with User to get username
    result = await db.execute(
        select(Student, User.username)
        .join(User, Student.user_id == User.user_id)
        .where(Student.class_id == subject.class_id)
    )
    
    students_data = []
    for student, username in result.all():
        students_data.append({
            "id": student.stu_id,
            "username": username,
            "roll_no": student.roll_no,
            "user_id": student.user_id
        })
        
    return students_data


# ─────────────────────────────────────────
# MARK ATTENDANCE (bulk — whole class at once)
# ─────────────────────────────────────────

@router.post("/attendance", status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    payload: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_teacher)
):
    # verify subject exists
    result = await db.execute(select(Subject).where(Subject.sub_id == payload.sub_id))
    subject = result.scalar_one_or_none()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # check if attendance already marked for this subject+date
    result = await db.execute(
        select(Attendance).where(
            Attendance.sub_id == payload.sub_id,
            Attendance.date   == payload.date
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this subject on this date"
        )

    # bulk insert all records
    records = [
        Attendance(
            stu_id=record.stu_id,
            sub_id=payload.sub_id,
            date=payload.date,
            status=record.status
        )
        for record in payload.records
    ]

    db.add_all(records)
    await db.commit()

    return {
        "message": "Attendance marked successfully",
        "count": len(records)
    }


# ─────────────────────────────────────────
# CORRECT AN ATTENDANCE RECORD
# ─────────────────────────────────────────

@router.put("/attendance/{atten_id}", response_model=AttendanceOut)
async def update_attendance(
    atten_id: int,
    new_status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_teacher)
):
    result = await db.execute(
        select(Attendance).where(Attendance.atten_id == atten_id)
    )
    record = result.scalar_one_or_none()

    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    record.status = new_status
    await db.commit()
    await db.refresh(record)
    return record


# ─────────────────────────────────────────
# VIEW ATTENDANCE BY SUBJECT
# ─────────────────────────────────────────

@router.get("/attendance/{sub_id}", response_model=list[AttendanceOut])
async def get_attendance_by_subject(
    sub_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(is_teacher)
):
    result = await db.execute(
        select(Attendance).where(Attendance.sub_id == sub_id)
    )
    return result.scalars().all()