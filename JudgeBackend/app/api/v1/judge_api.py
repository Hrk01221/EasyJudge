from fastapi import APIRouter
from app.schemas.submission_schema import UserSubmission
from app.services.code_runner_services import execute_submission

router = APIRouter()

@router.post("/submit")
def ExecuteSubmission(submission : UserSubmission):
    return execute_submission(submission.source_code , submission.input , submission.language)