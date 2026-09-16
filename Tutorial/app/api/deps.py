from fastapi import Depends , HTTPException , status , Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt , JWTError
from app.core.config import settings
from app.db.session import get_db
from app.services.auth_service import get_user_by_email

class oAuth2PasswordBearerWithCookies(OAuth2PasswordBearer):
    async def __call__(self, request:Request):

        token = request.cookies.get("access_token")

        if not token:
            authorization = request.headers.get("Authorization")
            if authorization and authorization.startswith("Bearer "):
                token = authorization.split(" ")[1]

        if not token:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not Authenticated"
                )
            return None

        return token


oauth2_schema = oAuth2PasswordBearerWithCookies(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def verify_token(token:str = Depends(oauth2_schema) , db : Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not Authenticated"
    )

    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=["HS256"])
        email : str = payload.get("sub")
        if email is None:
            raise credential_exception
        
    except JWTError:
        raise credential_exception

    user = get_user_by_email(db,email)

    if not user:
        raise credential_exception

    return user

    