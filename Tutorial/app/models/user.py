from sqlalchemy import Column , Integer , String , Boolean , DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True , index=True)

    username = Column(String , unique=True , nullable=False , index=True)
    email = Column(String , unique=True , nullable=False , index=True)

    codeforces_handle = Column(String , unique=True , index=True)
    challenge_problem_link = Column(String)
    challenge_started_at = Column(DateTime(timezone=True),nullable=True)
    is_cf_verified = Column(Boolean , default=False)

    unsolved_problems = Column(JSONB , default=list)

    hashed_password = Column(String , nullable=False)

    is_admin = Column(Boolean , default=False)                                                     

    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

class PendingUser(Base):
    __tablename__ = "pending_users"

    id = Column(Integer , primary_key=True , index=True)
    
    username = Column(String , unique=True , nullable=False , index=True)
    email = Column(String , unique=True , nullable=False , index=True)

    hashed_otp = Column(String, nullable=True)
    otp_created_at = Column(DateTime(timezone=True) , nullable=True)

    hashed_password = Column(String , nullable=False)

    created_at = Column(DateTime(timezone=True),server_default=func.now())
