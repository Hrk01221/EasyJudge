# uvicorn app.main:app --reload --port 8001

from fastapi import FastAPI
from app.schemas.submission_schema import UserSubmission
from app.services.code_runner_services import run_cpp

app = FastAPI()


@app.get("/")
def Home():
    return {
        "messge" : "ok"
    }

@app.post("/submit")
def Submit(submission : UserSubmission):
    return run_cpp(submission.source_code , submission.input)
