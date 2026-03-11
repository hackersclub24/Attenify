from fastapi import FastAPI
from app.db import engine,Base,get_db
from contextlib import asynccontextmanager
# import models
from app.models import User

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
