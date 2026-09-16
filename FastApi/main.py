from fastapi import FastAPI , HTTPException , Depends
from sqlalchemy.orm import Session 
from database import engine , SessionLocal
import models , schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Home API
@app.get("/")
def home():
    return {
        "message" : "Blog API START",
    }

# Create Blog
@app.post("/blogs" , response_model=schemas.BlogResponse)
def create_blog(blog : schemas.BlogCreate , db : Session=Depends(get_db)):
    new_blog = models.Blog(
        title = blog.title,
        content = blog.content
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

# Read all blogs
@app.get("/blogs" , response_model=list[schemas.BlogResponse])
def get_blogs(db:Session=Depends(get_db)):
    blogs = db.query(models.Blog).all()
    return blogs

# Read single blog by id
@app.get("/blogs/{blog_id}" , response_model=schemas.BlogResponse)
def get_blog(blog_id:int,db:Session=Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()

    if not blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    return blog

# Update blog
@app.put("/blogs/{blog_id}" , response_model=schemas.BlogResponse)
def update_blog(blog_id:int,upd_blog:schemas.BlogCreate,db:Session=Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id==blog_id).first()

    if not blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    blog.title = upd_blog.title
    blog.content = upd_blog.content

    db.commit()

    return blog

# delete blog
@app.delete("/blogs/{blog_id}")
def delete_blog(blog_id:int,db:Session=Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id==blog_id).first()

    if not blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    db.delete(blog)
    db.commit()

    return {"message" : "blog deleted successfully"}
