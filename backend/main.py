from fastapi import FastAPI
from routes.routes import router
from database.opportunity import ensure_opportunity_indexes

app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def startup_event():
    ensure_opportunity_indexes()


# Optional: enable CORS later for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "https://your-frontend.vercel.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )