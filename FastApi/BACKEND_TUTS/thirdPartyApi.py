import requests
from fastapi import FastAPI

# Basic Python way
# response = requests.get("https://codeforces.com/api/contest.list?gym=true")
# data = response.json()
# print(data["result"][:10])

app = FastAPI()

# Get all data
@app.get("/contest-list")
def get_contests():
    url = "https://codeforces.com/api/contest.list?gym=true"
    response = requests.get(url)
    return response.json()

# for post we can use similiarly
