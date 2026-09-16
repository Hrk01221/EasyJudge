# hide sensitive info
from fastapi import FastAPI , status , HTTPException , Request , Depends , Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse


app = FastAPI()

# users = []

# actual data that we get from user 
# class User(BaseModel):
#     id : int
#     name : str
#     email : str
#     password : str

# The data we want user to see hide the password
# class UserResponse(BaseModel):
#     id : int
#     name : str
#     email : str

# @app.post("/user")
# def post_user(user:User): 
#     users.append(user)
#     return {
#         "message" : "User created successful",
#         "data" : user
#     }

#  here response model makes it such we will get the model same as the UserResponse model other fields will be removed
# @app.get("/user" , response_model=UserResponse)
# def get_user():
#     return {
#         "id" : 1,
#         "name":"hrk",
#         "email" : "hrk@gmail.com",
#         "password" : "ninja",
#         "random" : "rnd"
#     }

# we just send a list instead of class
# @app.get("/user" , response_model=list[UserResponse])
# def get_user():
#     return users

# Status Code #
# from fastapi import status

# @app.post("/create_user" , status_code=status.HTTP_201_CREATED) # Here status code is returned 201 if successful
# def create_user():
#     return {"message" : "User Created Successfully"}

# Custom status code
# @app.get("/user")
# def get_user():
#     return {
#         "status" : "Success", # this is hardcoded and sent in frontend
#         "message" : "User fetched",
#         "data":{
#             "name" : "hrk",
#             "age" : 23
#         }
#     }

# Error Handling
# from fastapi import HTTPException

# @app.get("/users/{user_id}") # basically try and cache
# def get_user(user_id : int):
#     if user_id != 1:
#         raise HTTPException(
#             status_code=404,
#             detail="User Not Found"
#         )
#     return {
#         "id" : 1,
#         "name" : "Mohit"
#     }

# Exception Handling

## Custom Exception
# class UserNotFoundException(Exception):
#     def __init__(self, name:str):
#         self.name = name

## Global Exception Handler
# from fastapi import Request
# from fastapi.responses import JSONResponse

# @app.exception_handler(UserNotFoundException) # We wrap UserNotFoundException here such way when its raised it shows the json response
# def user_not_found_handler(request : Request , exc : UserNotFoundException): # This is the professional way
#     return JSONResponse( # Returns a json response
#         status_code=404,
#         content={
#             "status" : "error",
#             "message" : f"User {exc.name} not found"
#         }
#     )

# @app.get("/user/{name}")
# def get_user(name : str):
#     if name != "hrk":
#         raise UserNotFoundException(name)
#     return {
#         "name" : name
#     }

# Dependency Injection
# from fastapi import Depends

# def common_logic():
#     return {
#         "message" : "Common Logic Executed"
#     }

# @app.get("/home")
# def home(data = Depends(common_logic)): # here dependency injection is applied and common_logic function gets executed automatically
#     return data

# Real world Example (Re-Usable Codes)
# def get_user():
#     return {
#         "name" : "hrk",
#         "email" : "hrk@gmail.com"
#     }
# # Here both profile and dashboard uses same dependency injection hence code is reused
# @app.get("/profile")
# def profile(user = Depends(get_user)):
#     return user
# @app.get("/dashboard")
# def dashboard(user = Depends(get_user)):
#     return user

# Verify token using dependency injection
# from fastapi import Header

# def verify_token(token: str = Header(None)): # here header is a way to give strings in postman / thunder client
#     if token != "mysecrettoken":
#         raise HTTPException(
#             status_code=401,
#             detail="User not Authorized"
#         )
#     return {
#             "name" : "hrk",
#             "email" : "hrk@gmail.com",
#             "age" : 23
#     }

# @app.get("/secure-data")
# def secure_data(user = Depends(verify_token)):
#     return {
#         "message" : "secure data accessed",
#         "user" : user
#     }