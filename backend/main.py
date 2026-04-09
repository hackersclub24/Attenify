from fastapi import FastAPI
from app.db import engine, Base, get_db
from contextlib import asynccontextmanager

# import models
from app.models import User
from app.routers import auth, admin, teacher, student, public

# app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        res = await conn.run_sync(
            lambda s: engine.dialect.has_table(s, User.__tablename__)
        )
        if not res:
            await conn.run_sync(Base.metadata.create_all)
    yield


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://attenify.vercel.app",
        "https://attendance-management-system-bay.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.on_event("startup")
async def startup():
    print("Connecting to DB...")
    async with engine.begin() as conn:
        print(" DB connected!")


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(teacher.router, prefix="/api/teacher", tags=["Teacher"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(public.router, prefix="/api/public", tags=["Public"])
