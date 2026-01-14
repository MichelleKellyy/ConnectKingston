from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import router

app = FastAPI()
app.include_router(router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # ✅ must be a list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
