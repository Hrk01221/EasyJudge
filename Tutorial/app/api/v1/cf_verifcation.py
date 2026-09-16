from fastapi import APIRouter , HTTPException , Depends , status
from sqlalchemy.orm import Session
from datetime import datetime , timezone , timedelta
import random
from app.services.cf_service import get_all_problems , get_user_by_cf_handle , get_users_last_submission , fetch_unsolved_problems
from app.api.deps import verify_token
from app.db.session import get_db

router = APIRouter()

@router.get("/verify/start")
def verification_start(cf_handle:str , curr_user = Depends(verify_token) , db : Session = Depends(get_db)):

    existing = get_user_by_cf_handle(db,cf_handle)

    if curr_user.is_cf_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User already verified!"
        )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account already binded with different user"
        )

    problems = get_all_problems()

    if not problems :
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving problems"
        )
    
    challenge_problem = random.choice(problems)
    challenge_problem_link = f"https://codeforces.com/problemset/problem/{challenge_problem["contestId"]}/{challenge_problem["index"]}"

    curr_user.codeforces_handle = cf_handle
    curr_user.challenge_problem_link = challenge_problem_link
    curr_user.challenge_started_at = datetime.now(timezone.utc)
    db.commit()

    return {
        "status" : "Successful",
        "challenge_problem_link" : challenge_problem_link,
        "expire_time_in_seconds" : "150"
    }

@router.get("/verify/end")
def verification_end(curr_user = Depends(verify_token) , db : Session = Depends(get_db)):

    not_verify_exception = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Could not find user submission"
    )

    if curr_user.is_cf_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CF User is already verified!"
        )

    if not all([curr_user.codeforces_handle , curr_user.challenge_problem_link , curr_user.challenge_started_at]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verification failed try again!"
        )

    time_limit = curr_user.challenge_started_at + timedelta(seconds=150)

    if datetime.now(timezone.utc) > time_limit:
        curr_user.codeforces_handle = None
        curr_user.challenge_problem_link = None
        curr_user.challenge_started_at = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can not verify User!"
        )

    data = get_users_last_submission(curr_user.codeforces_handle)

    if not data:
        raise not_verify_exception

    link = f"https://codeforces.com/problemset/problem/{data[0]["problem"]["contestId"]}/{data[0]["problem"]["index"]}"

    if link != curr_user.challenge_problem_link or data[0]["verdict"] != "COMPILATION_ERROR":
        raise not_verify_exception

    curr_user.challenge_problem_link = None
    curr_user.challenge_started_at = None
    curr_user.is_cf_verified = True
    curr_user.unsolved_problems = fetch_unsolved_problems(curr_user.codeforces_handle)

    db.commit()

    return {
        "status" : "ok",
        "message" : "User Successfully Verified!"
    }
        