from sqlalchemy import Column , Integer , String , DateTime , ForeignKey , Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class ResetPasswordToken(Base):
    __tablename__ = "resetpassword_token"

    id = Column(Integer , primary_key=True , index=True)
    user_id = Column(Integer , ForeignKey("users.id") , nullable=False , index=True)
    token_hash = Column(String , nullable=True , unique=True , index=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean , default=False)

    user = relationship("User" , backref="resetpassword_token")