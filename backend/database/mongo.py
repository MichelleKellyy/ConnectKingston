from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv("MONGO_URI")
if not connection_string:
    raise ValueError("MONGO_URI is missing from .env")

client = MongoClient(connection_string, serverSelectionTimeoutMS=10000)

db = client["connectkingston"]  # one app database
user_collection = db["user_profile"]
opportunity_collection = db["opportunities"]

def db_connect():
    try:
        client.admin.command("ping")
        print("Connected to MongoDB Successfully!!")
    except Exception as error:
        print("MongoDB connection error:", error)

db_connect()
