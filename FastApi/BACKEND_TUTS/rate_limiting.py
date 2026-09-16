from fastapi import FastAPI,Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

app = FastAPI()

# Setup Limiter
limiter = Limiter(key_func=get_remote_address) # identify clients by their IP address
app.state.limiter = limiter # attaches the limiter to the app's state

# Error Handle
@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request:Request , exc : RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail" : "Too many request"
        }
    )

# API
@app.get("/data")
@limiter.limit("5/minute")
def get_data(request:Request): # parameter is required in the route function — slowapi needs it to inspect the incoming request
    return{
        "message" : "Data accessed"
    }