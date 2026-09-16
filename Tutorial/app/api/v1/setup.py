from fastapi import APIRouter , HTTPException , Depends , status
from sqlalchemy.orm import Session
from app.api.deps import verify_token
from app.db.session import get_db
from app.services.cf_service import fetch_unsolved_problems , generate_problems

router = APIRouter()

@router.get("/generate-problemset")
def generate_problemset(curr_user = Depends(verify_token) , db : Session = Depends(get_db)):

    if not curr_user.is_cf_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not verified!"
        )
    
    curr_user.unsolved_problems = fetch_unsolved_problems(curr_user.codeforces_handle)

    db.commit()

    if not curr_user.unsolved_problems:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find any problems that are upsolvable!"
        )

    problemset = generate_problems(curr_user.unsolved_problems)

    if not problemset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Can't generate problemset!"
        )

    return {
        "status" : "ok",
        "problemset" : problemset
    }