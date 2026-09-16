from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/contest-info")
def get_all_contest(page:int=1,lim:int=10):
    response = requests.get("https://codeforces.com/api/contest.list?gym=true")

    data = response.json()["result"]

    start = (page - 1) * lim
    end = start + lim

    return data[start : end]

