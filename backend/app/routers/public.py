from fastapi import APIRouter, Depends
from sqlalchemy import case, distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Attendance, Class, Student, Subject

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


@router.get("/landing-preview")
async def get_landing_preview(db: AsyncSession = Depends(get_db)):
    classes_count = int(await db.scalar(select(func.count(Class.class_id))) or 0)
    students_count = int(await db.scalar(select(func.count(Student.stu_id))) or 0)

    totals = await db.execute(
        select(
            func.count(Attendance.atten_id).label("total"),
            func.sum(case((Attendance.status == "present", 1), else_=0)).label("present"),
        )
    )
    total_records, present_records = totals.one()
    total_records = int(total_records or 0)
    present_records = int(present_records or 0)

    avg_attendance = round((present_records / total_records) * 100, 1) if total_records > 0 else 0.0

    latest_date = await db.scalar(select(func.max(Attendance.date)))
    present_today = 0.0
    if latest_date:
        today_totals = await db.execute(
            select(
                func.count(Attendance.atten_id).label("total"),
                func.sum(case((Attendance.status == "present", 1), else_=0)).label("present"),
            ).where(Attendance.date == latest_date)
        )
        total_today, present_today_count = today_totals.one()
        total_today = int(total_today or 0)
        present_today_count = int(present_today_count or 0)
        present_today = round((present_today_count / total_today) * 100, 1) if total_today > 0 else 0.0

    recent_activity = []
    subjects = (
        await db.execute(select(Subject.sub_id, Subject.sub_name).order_by(Subject.sub_id.desc()).limit(4))
    ).all()
    for sub_id, sub_name in subjects:
        completed = False
        if latest_date:
            marked = await db.scalar(
                select(func.count(Attendance.atten_id)).where(
                    Attendance.sub_id == sub_id,
                    Attendance.date == latest_date,
                )
            )
            completed = int(marked or 0) > 0

        recent_activity.append(
            {
                "name": sub_name,
                "status": "Complete" if completed else "In Progress",
            }
        )

    trend_rows = (
        await db.execute(
            select(
                Attendance.date,
                func.count(Attendance.atten_id).label("total"),
                func.sum(case((Attendance.status == "present", 1), else_=0)).label("present"),
            )
            .group_by(Attendance.date)
            .order_by(Attendance.date.desc())
            .limit(5)
        )
    ).all()

    weekly_trend = []
    for date_value, total, present in reversed(trend_rows):
        total = int(total or 0)
        present = int(present or 0)
        pct = round((present / total) * 100, 1) if total > 0 else 0.0
        weekly_trend.append({"day": date_value.strftime("%a"), "percentage": pct})

    if not recent_activity:
        recent_activity = [
            {"name": "Class 10-A", "status": "Complete"},
            {"name": "Class 12-B", "status": "In Progress"},
            {"name": "Lab Session", "status": "Complete"},
            {"name": "Tutorial", "status": "In Progress"},
        ]

    if not weekly_trend:
        weekly_trend = [
            {"day": "Mon", "percentage": 92.0},
            {"day": "Tue", "percentage": 88.0},
            {"day": "Wed", "percentage": 95.0},
            {"day": "Thu", "percentage": 85.0},
            {"day": "Fri", "percentage": 91.0},
        ]

    if classes_count == 0:
        classes_count = 12
    if students_count == 0:
        students_count = 234
    if present_today == 0:
        present_today = 92.0
    if avg_attendance == 0:
        avg_attendance = 89.0

    return {
        "stats": {
            "total_students": students_count,
            "classes": classes_count,
            "present_today": present_today,
            "avg_attendance": avg_attendance,
        },
        "recent_activity": recent_activity,
        "weekly_trend": weekly_trend,
    }
