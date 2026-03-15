# app/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import User, Admin, Teacher, Student, Class, Subject
from app.schemas import (
    UserCreate, UserOut,
    AdminCreate, AdminOut,
    TeacherCreate, TeacherOut,
    StudentCreate, StudentOut,
    ClassCreate, ClassOut,
    SubjectCreate, SubjectOut
)
from app.dependencies import is_admin
from app.routers.auth import hash_password

router = APIRouter()


# ─────────────────────────────────────────
# USERS
# ─────────────────────────────────────────

@router.get("/users", response_model=list[UserOut])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(User))
    return result.scalars().all()


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    # check username or email already exists
    result = await db.execute(
        select(User).where(
            (User.username == payload.username) | (User.email == payload.email)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    user = User(
        username=payload.username,
        password=hash_password(payload.password),
        role=payload.role,
        email=payload.email,
        status=payload.status
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.username = payload.username
    user.email    = payload.email
    user.role     = payload.role
    user.status   = payload.status
    if payload.password:
        user.password = hash_password(payload.password)

    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()


# ─────────────────────────────────────────
# CLASSES
# ─────────────────────────────────────────

@router.get("/classes", response_model=list[ClassOut])
async def get_all_classes(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Class))
    return result.scalars().all()


@router.post("/classes", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(
    payload: ClassCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    cls = Class(class_name=payload.class_name, section=payload.section)
    db.add(cls)
    await db.commit()
    await db.refresh(cls)
    return cls


@router.put("/classes/{class_id}", response_model=ClassOut)
async def update_class(
    class_id: int,
    payload: ClassCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Class).where(Class.class_id == class_id))
    cls = result.scalar_one_or_none()

    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    cls.class_name = payload.class_name
    cls.section    = payload.section

    await db.commit()
    await db.refresh(cls)
    return cls


@router.delete("/classes/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Class).where(Class.class_id == class_id))
    cls = result.scalar_one_or_none()

    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    await db.delete(cls)
    await db.commit()


# ─────────────────────────────────────────
# SUBJECTS
# ─────────────────────────────────────────

@router.get("/subjects", response_model=list[SubjectOut])
async def get_all_subjects(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Subject))
    return result.scalars().all()


@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
async def create_subject(
    payload: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    subject = Subject(
        sub_name=payload.sub_name,
        teacher_id=payload.teacher_id,
        class_id=payload.class_id
    )
    db.add(subject)
    await db.commit()
    await db.refresh(subject)
    return subject


@router.put("/subjects/{sub_id}", response_model=SubjectOut)
async def update_subject(
    sub_id: int,
    payload: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Subject).where(Subject.sub_id == sub_id))
    subject = result.scalar_one_or_none()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    subject.sub_name   = payload.sub_name
    subject.teacher_id = payload.teacher_id
    subject.class_id   = payload.class_id

    await db.commit()
    await db.refresh(subject)
    return subject


@router.delete("/subjects/{sub_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
    sub_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Subject).where(Subject.sub_id == sub_id))
    subject = result.scalar_one_or_none()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    await db.delete(subject)
    await db.commit()