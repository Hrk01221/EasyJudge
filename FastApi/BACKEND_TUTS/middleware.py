from fastapi import FastAPI , Request
import time # This is important

app = FastAPI()

# MiddleWare
# in middle ware use async function #

# @app.middleware("http")
# async def my_middleware(request:Request,call_next): # call next is use for response flow
#     print("Request Recieved")

      ## call_next(request) passes the request to the next layer
      ## and returns the response produced by the endpoint.
#     response = await call_next(request)

#     print("Response Sent")

#     return response

## loggging middleware (detect how much time was needed to get the response after calling request)

# @app.middleware("http") # Can use https also
# async def log_middleware(request:Request,call_next):
#     start_time = time.time()

#     response = await call_next(request)

#     process_time = time.time() - start_time

#     print(f"path : {request.url.path} | Time : {process_time}")
      #   request.url.path
      #   request.method
      #   request.headers
      #   request.client

#     return response

