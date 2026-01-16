from fastapi import FastAPI
from routes.routes import router
from database.opportunity import ensure_opportunity_indexes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware BEFORE including routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    ensure_opportunity_indexes()

# Include router AFTER middleware
app.include_router(router)