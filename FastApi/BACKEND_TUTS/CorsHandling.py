# Cross Origin Resource Sharing
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # allow frontend
    allow_credentials= True,
    allow_methods=["*"], # allow everything for get , put , post , delete
    allow_headers= ["*"]
)

@app.get("/")
def home():
    return {
        "message" : "Cors enabled API"
    }

