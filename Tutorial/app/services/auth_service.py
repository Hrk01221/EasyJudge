from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from datetime import datetime , timedelta , timezone
from app.models.user import User , PendingUser
from app.schemas.user import UserCreate
from app.core.security import create_hash , generate_otp , verify_hash
from app.utils.mail import send_otp_email , send_welcome_email

def get_user_by_email(db:Session,email:str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_name(db:Session,username:str):
    return db.query(User).filter(User.username == username).first()

def get_pending_user_by_name(db:Session,username:str):
    return db.query(PendingUser).filter(PendingUser.username == username).first()

def get_pending_user_by_email(db:Session,email:str):
    return db.query(PendingUser).filter(PendingUser.email == email).first()

def check_pending_registration(db:Session,email:str,username:str):

    now = datetime.now(timezone.utc)

    userbyname = get_pending_user_by_name(db,username)
    if userbyname and userbyname.otp_created_at + timedelta(minutes=5) <= now:
        db.delete(userbyname)
    elif userbyname:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User name / email already in use!"
        )

    userbyemail = get_pending_user_by_email(db,email)
    if userbyemail and userbyemail.otp_created_at + timedelta(minutes=5) <= now:
        db.delete(userbyemail)
    elif userbyemail:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User name / email already use!"
        )

    db.commit() 

async def create_user(db:Session,user_in:PendingUser):
    new_user = User(
        username = user_in.username,
        email = user_in.email,
        hashed_password = user_in.hashed_password,
        created_at = user_in.created_at
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    await send_welcome_email([user_in.email] , user_in.username)
    return new_user

async def create_pending_user(db:Session,user_in:UserCreate):
    OTP = generate_otp()
    await send_otp_email([user_in.email] , OTP)
    new_pending_user = PendingUser(
        username = user_in.username,
        email = user_in.email,
        hashed_otp = create_hash(OTP),
        otp_created_at = datetime.now(timezone.utc),
        hashed_password = create_hash(user_in.password)
    )
    db.add(new_pending_user)
    db.commit()
    db.refresh(new_pending_user)
    return new_pending_user

def authenticate_user(db:Session , username : str , password : str):
    user_with_email = get_user_by_email(db,username)
    user_with_username = get_user_by_name(db,username)
    
    user = None
    
    if user_with_email:
        user = user_with_email
    
    if user_with_username:
        user = user_with_username
    
    if not user or not verify_hash(password , user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials!"
        )
    
    return user