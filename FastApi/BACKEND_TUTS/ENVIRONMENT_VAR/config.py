import os
from dotenv import load_dotenv
load_dotenv()
class Settings:
    origins = os.getenv("ORIGINS")
    SECRET_KEY = os.getenv("SECRET_KEY")
    DB_URL = os.getenv("DB_URL")

settings = Settings()

# Use this to get the env things
# from config import settings
# To access
# SECRET_KEY = settings.SECRET_KEY