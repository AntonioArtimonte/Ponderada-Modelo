from fastapi import FastAPI
from fastapi.routers import predict_router

app = FastAPI()

app.include_router(predict_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Crypto currency API"}