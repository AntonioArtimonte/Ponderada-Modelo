from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.predict_router import router as predict_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.include_router(predict_router)
