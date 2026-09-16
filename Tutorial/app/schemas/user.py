from pydantic import BaseModel , EmailStr , Field , ConfigDict

class UserCreate(BaseModel):
    username : str = Field(min_length=3,max_length=100)
    email : EmailStr
    password : str = Field(min_length=8 , max_length=72)

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id : int
    username : str
    email : EmailStr
    codeforces_handle : str | None = None
    is_cf_verified : bool

class VerifyOtpSchema(BaseModel):
    otp : str
    email : str

class ChangePasswordSchema(BaseModel):
    curr_password : str = Field(min_length=8 , max_length=72)
    new_password : str = Field(min_length=8 , max_length=72)

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

class VerifyResetTokenRequest(BaseModel):
    token: str