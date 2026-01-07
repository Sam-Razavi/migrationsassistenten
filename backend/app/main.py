from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.database import init_db
from app.routers import cases


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Migrationsassistenten",
    description="Swedish migration court appeal assistant",
    version="1.0.0",
    lifespan=lifespan,
)


app.include_router(cases.router)


@app.get("/")
async def root():
    return {"message": "Migrationsassistenten API", "version": "1.0.0"}
