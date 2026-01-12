from fastapi import FastAPI
from routes.routes import router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
app.include_router(router)



"""Below code we will uncomment once we get started with connecting with frontend as thsi will 
help to deal with CORS policy error"""
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://credit-card-fraud-detector-five.vercel.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
