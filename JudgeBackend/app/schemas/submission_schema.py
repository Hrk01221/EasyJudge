from pydantic import BaseModel

class UserSubmission(BaseModel):
    source_code : str
    input : str

