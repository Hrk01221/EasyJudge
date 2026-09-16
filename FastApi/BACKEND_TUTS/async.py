# Handling Multiple request in a single time
# Non blocking execution

import time
import asyncio
from fastapi import FastAPI

app = FastAPI()

# synchronous task it waits
def task():
    time.sleep(3)
    return "done"

# asynchronous task wiats but without blocking
async def async_task(): 
    await asyncio.sleep(3)
    return "done"

# Fast api version
@app.get("/")
async def home():
    await asyncio.sleep(3)
    return{
        "message" : "Async Api"
    }

# Importance
# multiple api calls can happen
# multiple db calls can happen
# external services can also be included

### If input / output operation is there use async