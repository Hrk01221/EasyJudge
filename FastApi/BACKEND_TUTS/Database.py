# pip install sqlalchemy
from sqlalchemy import create_engine , Column , Integer , String
from sqlalchemy.orm import sessionmaker,declarative_base , Session
from fastapi import FastAPI , Depends , HTTPException

app = FastAPI()

DATABASE_URL = "sqlite:///./db/test.db" # url of db

engine = create_engine( # connect the db
    DATABASE_URL,
    connect_args={"check_same_thread" : False}
)

sessionlocal = sessionmaker(bind=engine) # to do operation in db

Base = declarative_base() # given base for creating Model

# Create a Model
class Todo(Base):
    __tablename__ = "todos" # table name

    id = Column(Integer , primary_key=True , index=True)
    title = Column(String)
    completed = Column(String)

Base.metadata.create_all(bind=engine) # Creates the db

# Simple db session provider
def get_db():
    db = sessionlocal()
    try:
        yield db # function stops here and gives the db to api
    finally:
        db.close() # then it comes back and closes db

@app.get("/")
def home(db:Session=Depends(get_db)):
    return{
        "message" : "DB connected"
    }

# CRUD with db

# Create #
@app.post("/todos")
def create_todo(title:str,db: Session = Depends(get_db)):
    todo = Todo(title=title,completed="False") # Create a new instance of todo and **as we used Todo model the data goes to todos table**
    db.add(todo)        # add the todo to db
    db.commit()         # commit it to todo 
    db.refresh(todo)    # refresh the db to fetch the newly updated db and ***get the latest id***
    return {
        "message" : "Todo Created Successfully",
        "data" : todo
    }

# Read #

## Read all data
@app.get("/todos")
def get_todos(db : Session = Depends(get_db)):
    todos = db.query(Todo).all() # Query to read all the data from a table
    return{
        "total" : len(todos),
        "data" : todos
    }

## Read a single data by id
@app.get("/todos/{todo_id}")
def get_todo(todo_id:int,db:Session=Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first() # Query to read a single data by id and return the first one
    if not todo:
        raise HTTPException(status_code=404,detail="Todo not found")
    return {
        "message" : "todo fetched successfully",
        "data" : todo
    }

# Update #
@app.put("/todos/{todo_id}")
def update_todo(todo_id:int , title:str, db : Session=Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id==todo_id).first()

    if not todo:
            raise HTTPException(status_code=404,detail="Todo not found")
    
    todo.title = title

    db.commit()
    db.refresh(todo) # to get the id

    return {
            "message" : "todo updated successfully",
            "data" : todo
        }

# Delete #
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id:int , db : Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id==todo_id).first()

    if not todo:
                raise HTTPException(status_code=404,detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {
         "message" : "Todo deleted successfully"
    }
