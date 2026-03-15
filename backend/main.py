from fastapi import FastAPI
from app.db import engine,Base,get_db
from contextlib import asynccontextmanager
# import models
from app.models import User
from app.routers import auth ,admin,teacher,student
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


app = FastAPI(lifespan=lifespan)


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
