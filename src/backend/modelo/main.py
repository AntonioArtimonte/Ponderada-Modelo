from fastapi import FastAPI
from routers.predict_router import router as predict_router

app = FastAPI()

app.include_router(predict_router)
