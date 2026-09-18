# uvicorn app.main:app --reload --port 8001

from fastapi import FastAPI
from app.api.v1.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI()
app.include_router(api_router , prefix=settings.API_V1_STR)

origins = [settings.FRONTEND_API]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # allow frontend
    allow_credentials= True,
    allow_methods=["*"], # allow everything for get , put , post , delete
    allow_headers= ["*"]
)

@app.get("/")
def Home():
    return {
        "status" : "ok"
    }

