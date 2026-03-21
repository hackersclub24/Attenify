from fastapi import APIRouter, Depends
from sqlalchemy import case, distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Attendance, Class, Student

router = APIRouter()


@router.get("/landing-stats")
async def get_landing_stats(db: AsyncSession = Depends(get_db)):
    classes_count = await db.scalar(select(func.count(Class.class_id)))
    students_count = await db.scalar(select(func.count(Student.stu_id)))

    attendance_totals = await db.execute(
        select(
            func.count(Attendance.atten_id).label("total"),
            func.sum(case((Attendance.status == "present", 1), else_=0)).label("present"),
            func.count(distinct(Attendance.date)).label("working_days"),
        )
    )
    total, present, working_days = attendance_totals.one()

    total = int(total or 0)
    present = int(present or 0)
    working_days = int(working_days or 0)

    present_rate = round((present / total) * 100, 1) if total > 0 else 0.0

    return {
        "classes": int(classes_count or 0),
        "students": int(students_count or 0),
        "present_rate": present_rate,
        "working_days": working_days,
    }
