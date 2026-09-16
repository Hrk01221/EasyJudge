from fastapi import  FastAPI # import fastapi library
from fastapi.responses import HTMLResponse #  to send a html code instead of json

# Create an instance of the FastAPI application.
# This object stores all routes, configurations, middleware, etc.
app = FastAPI() 

# to run server -> fastapi dev filename.py(main.py)


# http://localhost:8000/ -> for main server
# http://localhost:8000/docs -> for swagger ui representation manging api's properly
# http://localhost:8000/redoc   -> ReDoc documentation

students = [
    {"name": "Alice", "age": 20, "cgpa": 3.8},
    {"name": "Bob", "age": 21, "cgpa": 3.5},
    {"name": "Charlie", "age": 19, "cgpa": 3.9}
]


# @app.get(...) is called a DECORATOR.
# It tells FastAPI that the function below should handle
# GET requests for the specified path.

# "/" and "/students" are called routes (or endpoints).
# A single function can handle multiple routes.

# response_class=HTMLResponse
# -> By default FastAPI returns JSON.
# -> HTMLResponse tells FastAPI to return HTML instead.

# include_in_schema=False
# -> Hides this endpoint from /docs and /redoc.
# -> The endpoint still works if accessed directly.

@app.get("/" , response_class=HTMLResponse , include_in_schema=False)
@app.get("/students" , response_class=HTMLResponse , include_in_schema=False)
def home():
    return f"<h1>{students[0]['name']}</h1>"

# FastAPI automatically converts Python objects
# (lists, dictionaries, etc.) into JSON.

@app.get("/api/students")
def get_students():
    return students

# @app.get(...)      -> Read data
# @app.post(...)     -> Create data
# @app.put(...)      -> Replace existing data
# @app.patch(...)    -> Update part of existing data
# @app.delete(...)   -> Delete data