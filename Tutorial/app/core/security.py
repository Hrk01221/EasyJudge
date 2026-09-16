import bcrypt
import secrets , hashlib
from jose import jwt
from datetime import datetime , timedelta , timezone
from app.core.config import settings

def create_hash(password:str):
    return bcrypt.hashpw(password.encode("utf-8") , bcrypt.gensalt()).decode("utf-8")

def verify_hash(plain:str,hashed:str):
    return bcrypt.checkpw(plain.encode("utf-8") , hashed.encode("utf-8"))

def generate_otp():
    otp = f"{secrets.randbelow(1_000_000):06d}"
    return otp

def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp" : expire
    })
    token = jwt.encode(to_encode , settings.SECRET_KEY , algorithm="HS256")
    return token

def create_refresh_token():
    return secrets.token_urlsafe(64)

def hash_token(token : str):
    return hashlib.sha256(token.encode()).hexdigest()
