from sqlalchemy.orm import Session
import requests
import time , random
from app.models.user import User

def get_user_by_cf_handle(db:Session , cf_handle: str):
    return db.query(User).filter(User.codeforces_handle == cf_handle , User.is_cf_verified == True).first()

cache_problems = []
last_fetch = 0

def get_all_problems():
    global cache_problems , last_fetch

    if time.time() - last_fetch > 360:

        url = "https://codeforces.com/api/problemset.problems"
        response = requests.get(url)

        cache_problems = response.json()["result"]["problems"]

        last_fetch = time.time()

    return cache_problems


def get_users_last_submission(cf_handle:str):
    url = f"https://codeforces.com/api/user.status?handle={cf_handle}&from=1&count=1"
    response = requests.get(url)
    return response.json()["result"]

def get_users_all_submission(cf_handle:str):
    url = f"https://codeforces.com/api/user.status?handle={cf_handle}"
    response = requests.get(url)
    return response.json()["result"]

def fetch_unsolved_problems(cf_handle: str):
    all_problems = get_all_problems()

    solved_problems = set()
    submissions = get_users_all_submission(cf_handle)

    for submission in submissions:
        if submission.get("verdict") != "OK":
            continue

        problem = submission.get("problem", {})

        cid = problem.get("contestId")
        index = problem.get("index")

        if cid is not None and index is not None:
            solved_problems.add((cid, index))

    unsolved_problems = []

    for problem in all_problems:
        key = (problem["contestId"], problem["index"])

        if key not in solved_problems:
            unsolved_problems.append(problem)

    return unsolved_problems

def generate_problems(problems):
    rating_ranges = {
        "A" : (800 , 1000),
        "B" : (1100 , 1300),
        "C" : (1400 , 1600),
        "D" : (1700 , 2000)
    }
    
    selected = []

    for index , (mn_rating , mx_rating) in rating_ranges.items():
        candidates = [
            p for p in problems
            if p["index"].startswith(index)
            and p.get("rating") is not None 
            and p["rating"] >= mn_rating and p["rating"] <= mx_rating
        ]

        if not candidates:
            continue

        selected.append(random.choice(candidates))

    return selected