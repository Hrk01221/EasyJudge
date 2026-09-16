from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message" : "Hello Hrk"
    }

@app.get("/add")
def add(x:int,y:int):
    return {
        "result" : x + y
    }



@app.post("/add_user")
def add_user(user : dict):
    return {
        "message" : "User Created",
        "user" : user
    }