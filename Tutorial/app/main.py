from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router,prefix=settings.API_V1_STR)

origins = [settings.FRONTEND_API]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # allow frontend
    allow_credentials= True,
    allow_methods=["*"], # allow everything for get , put , post , delete
    allow_headers= ["*"]
)


@app.get("/")
def home():
    return {
        "message" : f"Server running on port {settings.PORT}"
    }
