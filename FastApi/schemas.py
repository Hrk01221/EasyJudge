from pydantic import BaseModel

# Input Schema
class BlogCreate(BaseModel):
    title : str
    content: str

# Output Schema
class BlogResponse(BaseModel):
    id : int
    title : str
    content : str

    class Config:
        # Allows Pydantic to create this schema(else will see as dict) from object 
        # attributes (e.g. SQLAlchemy objects)
        from_attributes = True