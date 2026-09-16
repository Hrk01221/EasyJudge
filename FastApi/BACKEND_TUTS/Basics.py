from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

#single route
@app.get("/")
def home():
    return {"message" : "Server started."}

# Multiple routes
# @app.get("/route1")
# @app.get("/route2")
# def About():
#     return {"message" : "This is multiple route"}

# dynamic routes (Path params)
# @app.get("/user/{user_id}")
# def get_user(user_id:int): # Here we define the type(int / str) we want the parameter (auto validation is used)
#     return {"User Id" : user_id}

# Query Parameters
# @app.get("/users") # Here we get url/users?name=Hrk
# def get_users(name):
#     return {"Name" : name} 

## Optional params
# @app.get("/users") 
# def get_users(name : int = None): # its Optional params if name not given it shows null
#     return {"Name" : name} 

## default values
# @app.get("/products")
# def get_limit(limit : int = 10): # here default value of limit set to 10
#     return {"limit" : limit}

## Multiple query params
# @app.get("/items")
# def get_items(name: str = None , price : int = 0): # Use & for multiple params url/items?name=hog&price=100
#     return {
#         "Name" : name,
#         "Price" : price
#     }

# request body
# @app.post("/create-user") 
# def create_user(name:str,age:int): # here if we use this it will work as query params way so we dont use this way
#     return {
#         "name" : name,
#         "age" : age
#     }

## give as a dict
# @app.post("/create-user")
# def create_user(user:dict): # here we send the user as whole not diff params
#     return {
#         "message" : "User Created!",
#         "data" : user # collect in data
#     }

## pydantic
# We use pydantic for validation
# from pydantic import BaseModel (import)

## Create Schema
# class User(BaseModel):
#     name: str
#     age: int
#     email: str

# @app.post("/create-user")
# def create_user(user:User): # now we use the User schema we made for auto validation
#     return {
#         "message" : "User Created",
#         "data" : user # collect in data
#     }

## Nested Models
# class Adress(BaseModel):
#     city : str
#     pincode : int

# class User(BaseModel):
#     name : str
#     age : int
#     adress : Adress # Nested schema used here!

# @app.post("/create-user")
# def create_user(user:User):
#     return user

