from fastapi import FastAPI
from routes.routes import router
from database.opportunity import ensure_opportunity_indexes
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import router

app = FastAPI()
app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def startup_event():
    ensure_opportunity_indexes()


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
