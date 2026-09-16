from fastapi import APIRouter
from app.api.v1 import auth , cf_verifcation , setup

api_router = APIRouter()

api_router.include_router(auth.router , prefix="/auth" , tags=["auth"])
api_router.include_router(cf_verifcation.router , prefix="/cf" , tags=["cf_verifcation"])
api_router.include_router(setup.router , prefix="/setup" , tags=["setup"])