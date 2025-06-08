from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="authorization Microservice",
    description="API for user authorization",
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