from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import router as widgets_router


app = FastAPI(
    title="Dashboard Constructor Microservice",
    description="API for managing dashboard widgets",
    version="1.0.0",
)


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(widgets_router)
