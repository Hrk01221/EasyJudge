from fastapi import FastAPI
import requests
import time

app = FastAPI()

# cache storage
cache_data = []
last_fetch = 0

@app.get("/contest-info")
def get_all_contest():
    global cache_data , last_fetch

    start = time.time()

    if time.time() - last_fetch > 60:

        print("Fetching New Data")

        response = requests.get("https://codeforces.com/api/contest.list?gym=true")

        cache_data = response.json()["result"]

        last_fetch = time.time()

    else :
        print("Use Cache Data")

    end = time.time()

    time_taken = round(end - start , 4)

    print("Time taken : " , time_taken)

    return {
        "time taken" : time_taken,
        "data" : cache_data[:10]
    }

    

