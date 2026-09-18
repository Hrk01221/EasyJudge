from fastapi import APIRouter
from app.api.v1 import judge_api

api_router = APIRouter()

api_router.include_router(judge_api.router , prefix="/judge" , tags=["judge"])