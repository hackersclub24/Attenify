# app/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import User, Admin, Teacher, Student, Class, Subject
from app.schemas import (
    UserCreate, UserUpdate, UserOut,
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
    payload: UserUpdate,
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

@router.get("/subjects")
async def get_all_subjects(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    # Fetch all subjects and join with Teacher -> User to get the username
    result = await db.execute(
        select(Subject, User.username.label('teacher_name'))
        .join(Teacher, Subject.teacher_id == Teacher.teacher_id)
        .join(User, Teacher.user_id == User.user_id)
    )
    
    subjects_data = []
    for subject, teacher_name in result.all():
        subj_dict = {
            "sub_id": subject.sub_id,
            "sub_name": subject.sub_name,
            "teacher_id": subject.teacher_id,
            "class_id": subject.class_id,
            "teacher_name": teacher_name
        }
        subjects_data.append(subj_dict)
        
    return subjects_data


@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
async def create_subject(
    payload: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    # The frontend sends `user_id` in the `teacher_id` field
    # We need to find or create the `Teacher` record for this user
    result = await db.execute(select(Teacher).where(Teacher.user_id == payload.teacher_id))
    teacher = result.scalar_one_or_none()

    if not teacher:
        # Auto-create the Teacher record if it doesn't exist yet
        teacher = Teacher(user_id=payload.teacher_id, dept="General")
        db.add(teacher)
        await db.commit()
        await db.refresh(teacher)

    subject = Subject(
        sub_name=payload.sub_name,
        teacher_id=teacher.teacher_id,
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


# ─────────────────────────────────────────
# STUDENTS
# ─────────────────────────────────────────

@router.get("/students")
async def get_all_students(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    # Fetch all students and join with User and Class to get names
    result = await db.execute(
        select(Student, User.username, Class.class_name, Class.section)
        .join(User, Student.user_id == User.user_id)
        .join(Class, Student.class_id == Class.class_id)
    )
    
    students_data = []
    for student, username, class_name, section in result.all():
        student_dict = {
            "stu_id": student.stu_id,
            "user_id": student.user_id,
            "roll_no": student.roll_no,
            "class_id": student.class_id,
            "username": username,
            "class_name": class_name,
            "section": section
        }
        students_data.append(student_dict)
        
    return students_data


@router.post("/students", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
async def create_student(
    payload: StudentCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    # Check if a student record already exists for this user_id
    result = await db.execute(select(Student).where(Student.user_id == payload.user_id))
    if result.scalar_one_or_none():
         raise HTTPException(status_code=400, detail="Student profile already exists for this user")

    student = Student(
        user_id=payload.user_id,
        roll_no=payload.roll_no,
        class_id=payload.class_id
    )
    db.add(student)
    await db.commit()
    
    # Refresh and load the user relationship to satisfy StudentOut schema
    result = await db.execute(select(Student).where(Student.stu_id == student.stu_id))
    student = result.scalar_one()
    # also we need the user object.
    user_result = await db.execute(select(User).where(User.user_id == payload.user_id))
    user = user_result.scalar_one()
    student.user = user

    return student


@router.put("/students/{stu_id}", response_model=StudentOut)
async def update_student(
    stu_id: int,
    payload: StudentCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Student).where(Student.stu_id == stu_id))
    student = result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.user_id = payload.user_id
    student.roll_no = payload.roll_no
    student.class_id = payload.class_id

    await db.commit()
    await db.refresh(student)
    return student


@router.delete("/students/{stu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    stu_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(is_admin)
):
    result = await db.execute(select(Student).where(Student.stu_id == stu_id))
    student = result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    await db.delete(student)
    await db.commit()