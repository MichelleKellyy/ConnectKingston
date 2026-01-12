from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

connection_string = os.getenv("MONGO_URI")

client=MongoClient(connection_string,serverSelectionTimeoutMS=3000)

#Selecting database
user_database=client['Users']

#selecting collection that exist inside database
user_collection=user_database['user_profile']


def db_connect():
    try: 
        client.admin.command('ping')
        print('Connected to MongoDB Successfully!!')
    except Exception as error:
        return {"Error":str(error)}

db_connect()