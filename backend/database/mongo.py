import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
load_dotenv()

connection_string = os.getenv("MONGO_URI")
if not connection_string:
    raise ValueError("MONGO_URI is missing from .env")

client = AsyncIOMotorClient(connection_string, serverSelectionTimeoutMS=10000)

db_connectKinsgton = client["connectkingston"]  # one app database
db_user=client['Users']
user_collection = db_user["user_profile"]
opportunity_collection = db_connectKinsgton["opportunities"]
favourites_opportunities=db_user['favourites_oppor']

def db_connect():
    try:
        client.admin.command("ping")
        print("Connected to MongoDB Successfully!!")
    except Exception as error:
        print("MongoDB connection error:", error)

db_connect()
