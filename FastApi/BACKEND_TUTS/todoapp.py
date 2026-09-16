from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Todo(BaseModel):
    id : int
    name : str
    completed : bool

todos = []

@app.get("/todos")
def get_todos():
    return todos

@app.post("/todos")
def post_todos(todo : Todo):
    todos.append(todo)
    return {
        "message" : "Todo created",
        "data" : todo
    }

@app.get("/todos/{todo_id}")
def get_todo(todo_id : int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    return {"error" : "No such todo id exist"}

@app.put("/todos/{todo_id}")
def update_todo(todo_id:int,updated_todo:Todo):
    for index,todo in enumerate(todos):
        if todo.id == todo_id:
            todos[index] = updated_todo
            return {
                "message" : "Update has been successful",
                "data" : updated_todo
            }
    return {"error" : "No such todo id exist"}

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id : int):
    for index,todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(index)
            return {"message" : "Delete has been successful",}
    return {"error" : "No such todo id exist"}
        