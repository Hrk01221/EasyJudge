from pydantic_settings import BaseSettings , SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env" , extra="ignore")

    PORT : int = 8000
    DB_CONNECTION : str
    API_V1_STR : str = "/api/v1"
    ACCESS_TOKEN_EXPIRE_MINUTES : int
    REFRESH_TOKEN_EXPIRE_DAYS : int
    RESET_PASSWORD_TOKEN_EXPIRE_MINUTES : int
    SECRET_KEY : str
    FRONTEND_API: str
    RESEND_API_KEY: str

settings = Settings()