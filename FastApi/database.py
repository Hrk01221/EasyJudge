from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base

# postgresql://username:password@localhost/dbname
DATABASE_URL = "postgresql://postgres:hrk01221@localhost/blogdb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()