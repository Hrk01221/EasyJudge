from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.resetpassword_token import ResetPasswordToken