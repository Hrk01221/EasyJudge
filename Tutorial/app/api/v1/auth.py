from fastapi import APIRouter, Depends, HTTPException, status , Response , Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse , VerifyOtpSchema , ChangePasswordSchema , ForgotPasswordSchema , ResetPasswordSchema , VerifyResetTokenRequest
from app.db.session import get_db
from app.services.auth_service import get_user_by_email, create_pending_user , get_user_by_name , check_pending_registration , get_pending_user_by_email , create_user , authenticate_user
from app.core.security import verify_hash , hash_token , create_access_token , create_refresh_token , create_hash
from app.models.refresh_token import RefreshToken
from app.models.resetpassword_token import ResetPasswordToken
from app.core.config import settings
from datetime import datetime , timedelta , timezone
from app.api.deps import verify_token
from app.utils.mail import send_forget_password_mail

router = APIRouter()

@router.post("/login" , status_code=status.HTTP_200_OK)
def login(response: Response , form_data: OAuth2PasswordRequestForm = Depends() , db : Session = Depends(get_db)):

    user = authenticate_user(db,form_data.username,form_data.password)

    print(user)

    access_token = create_access_token({"sub":user.email})
    raw_refresh_token = create_refresh_token()
    refresh_token = RefreshToken(
        user_id = user.id,
        token_hash = hash_token(raw_refresh_token),
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(refresh_token)
    db.commit()

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none", # cookies sent if url matches in both frontend & backend
        max_age=1800,
        path="/"
    )
    response.set_cookie(    
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path=f"{settings.API_V1_STR}/auth/refresh"
    )

    return{
        "status" : "ok",
        "message" : "Login successful"
    }

@router.post("/refresh" , status_code=200)
def refresh(response:Response , request:Request , db:Session=Depends(get_db)):
    raw_token = request.cookies.get("refresh_token")
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token!"
        )

    token_hash = hash_token(raw_token)
    db_token = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash , 
                                            RefreshToken.revoked == False).first()

    if not db_token or db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user = db_token.user

    db_token.revoked = True
    new_refresh_token = create_refresh_token()
    db.add(RefreshToken(
        user_id = user.id,
        token_hash = hash_token(new_refresh_token), 
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    ))
    db.commit()

    new_access_token = create_access_token({"sub":user.email})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=1800,
        path="/"
    )
    response.set_cookie(    
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path=f"{settings.API_V1_STR}/auth/refresh"
    )
    return {
        "status" : "ok",
        "message" : "token refreshed successfully"
    }


@router.post("/register", status_code=200)
async def register(user:UserCreate , db:Session=Depends(get_db)):
    if get_user_by_name(db,user.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User name / email Already Exists!"
        )
    if get_user_by_email(db,user.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User name / email Already Exists!"
        )

    check_pending_registration(db,user.email,user.username)
    created_user = await create_pending_user(db,user)

    return {
        "status" : "ok",
        "email" : created_user.email,
        "message" : "OTP sent successfully",
        "expires_at" : created_user.otp_created_at + timedelta(minutes=5)
    }

@router.post("/register/verify" , status_code=201)
async def verify_register(data: VerifyOtpSchema, db:Session=Depends(get_db)):

    pending_user = get_pending_user_by_email(db,data.email)
    if not pending_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User info exception"
        )

    now = datetime.now(timezone.utc)
    expires_at = pending_user.otp_created_at + timedelta(minutes=5)
    if expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="OTP Expired"
        )



    if not verify_hash(data.otp , pending_user.hashed_otp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP"
        )

    created_user = await create_user(db,pending_user)
    db.delete(pending_user)
    db.commit()
    db.refresh(created_user)
    
    return{
        "status" : "ok",
        "message" : "User Created Successfully",
        "data" : created_user
    }


@router.post("/logout")
async def logout(response : Response , request : Request , db : Session = Depends(get_db)):
    raw_token = request.cookies.get("refresh_token")
    if raw_token:
        token_hash = hash_token(raw_token)
        db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).update({"revoked" : True})
        db.commit()

    response.delete_cookie(
        "access_token",
        path="/",
        secure=True,
        samesite="none",
    )
    response.delete_cookie(
        "refresh_token",
        path=f"{settings.API_V1_STR}/auth/refresh",
        secure=True,
        samesite="none",
    )

    return {
        "status": "ok",
        "message": "logout successful"
    }

@router.post("/change-password")
def change_password(response:Response, data : ChangePasswordSchema , curr_user=Depends(verify_token) , db:Session=Depends(get_db)):

    if not verify_hash(data.curr_password , curr_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials"
        )

    curr_user.hashed_password = create_hash(data.new_password)

    db.add(curr_user)

    # revoke existing ref
    db.query(RefreshToken).filter(
        RefreshToken.user_id == curr_user.id,
        RefreshToken.revoked == False
    ).update({"revoked" : True})

    db.commit()

    access_token = create_access_token({"sub":curr_user.email})
    raw_refresh_token = create_refresh_token()
    refresh_token = RefreshToken(
        user_id = curr_user.id,
        token_hash = hash_token(raw_refresh_token),
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(refresh_token)
    db.commit()

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=1800,
        path="/"
    )
    response.set_cookie(    
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path=f"{settings.API_V1_STR}/auth/refresh"
    )

    return{
        "status" : "ok",
        "message" : "Password changed successfully"
    }

@router.post("/forgot-password")
async def forgot_password(data:ForgotPasswordSchema,db:Session=Depends(get_db)):
    user = get_user_by_email(db,data.email)
    if user:
        raw_token = create_refresh_token()
        db.add(ResetPasswordToken(
            user_id = user.id,
            token_hash = hash_token(raw_token),
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.RESET_PASSWORD_TOKEN_EXPIRE_MINUTES)
        ))
        db.commit()

        await send_forget_password_mail([user.email] , raw_token)

    return{
        "status" : "ok",
        "message" : "If that email exists, a reset link has been sent."
    }

@router.post("/verify-reset-token")
def verify_reset_token(data:VerifyResetTokenRequest,db:Session = Depends(get_db)):
    token_hash = hash_token(data.token)

    db_token = db.query(ResetPasswordToken).filter(ResetPasswordToken.token_hash == token_hash , 
                                                   ResetPasswordToken.revoked == False).first()
    
    if not db_token or db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link"
        )

    return {
        "status" : "ok",
        "message" : "token is verified"
    }

@router.post("/reset-password")
def reset_password(data:ResetPasswordSchema , db: Session = Depends(get_db)):
    token_hash = hash_token(data.token)

    db_token = db.query(ResetPasswordToken).filter(ResetPasswordToken.token_hash == token_hash , 
                                                   ResetPasswordToken.revoked == False).first()
    
    if not db_token or db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link"
        )

    user = db_token.user
    user.hashed_password = create_hash(data.new_password)
    db.add(user)

    db_token.revoked = True

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked == False
    ).update({"revoked" : True})

    db.commit()

    return{
        "status" : "ok",
        "message" : "Reset password successful"
    }


@router.get("/me" , response_model=UserResponse)
def get_user(user = Depends(verify_token)):
    return user