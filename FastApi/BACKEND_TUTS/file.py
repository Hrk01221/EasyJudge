# Used for static file serving and file upload api
from fastapi import FastAPI , UploadFile , File , HTTPException
from fastapi.staticfiles import StaticFiles
import os
import shutil # for file related things

app = FastAPI()

# Ensure Upload folder exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Setup static files
# This below creates a URL : HTTP://127.0.0.1:8080/FILES/<FILENAME>
app.mount("/files",StaticFiles(directory=UPLOAD_DIR),name="files")

# Upload file api
@app.post("/upload")
def upload_file(file : UploadFile=File(...)):
    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR , filename)

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="File not Selected"
        )

    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)

        return {
            "message" : "File Upload Successfully",
            "filename" : filename,
            "fileurl" : f"http://127.0.0.1:8000/files/{filename}"
        }

# Get File URL API
@app.get("/file-info/{filename}")
def get_file(filename:str):
    file_path = os.path.join(UPLOAD_DIR , filename) 

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    
    return{
        "fileurl" : f"http://127.0.0.1:8000/files/{filename}"
    }

@app.get("/")
def home():
    return {
        "message" : "File Uploading api running"
    }

# Note : http://127.0.1:8000/files/<filename> is the url to access the file after upload