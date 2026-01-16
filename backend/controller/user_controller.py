from model.model import User
from database.mongo import user_collection
from fastapi import HTTPException


def default_msg():
    return "Welcome to backend"

#GET USER BY FIREBASE ID
def get_user_by_id(uid:str):
    print("UID RECEIVED:", uid)
    print("DB NAME:", user_collection.database.name)
    print("COLLECTION NAME:", user_collection.name)
    result=user_collection.find_one({"user_id":uid.strip()})
    
    print("QUERY RESULT:", result)
    if(result):
        result['_id']=str(result['_id'])
        return result
    else:
        return "User not exist"
# CREATE USER 
def create_user(user: User):
    try:
        # Check if user already exists
        if user_collection.find_one({"user_id": user.user_id}):
            raise HTTPException(status_code=400, detail="User already exists")

        result = user_collection.insert_one(user.dict())
        return {
            "message": "User created",
            "id": str(result.inserted_id)
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(error)}")


# UPDATE USER 
def update_user(user_id: str, updated_user: User):
    try:
        result = user_collection.update_one(
            {"user_id": user_id},
            {"$set": updated_user.dict()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User updated successfully"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(error)}")


# DELETE USER 
def delete_user(user_id: str):
    try:
        result = user_collection.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User deleted successfully"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(error)}")
    

def normalize_user(user_doc):
    p = user_doc["profile"]
    return {
        "full_name": p.get("full_name", ""),
        "location": p.get("postal_code", ""),
        "skills": p.get("skills", []),
        "interests": p.get("interests", []),
        "availability_hours": p.get("availability_hours_per_week", "")
    }


def normalize_opps(opps):
    normalized = []
    for o in opps:
        normalized.append({
            "title": o.get("raw", {}).get("title", "Untitled"),
            "location": o.get("location_text", ""),
            "cause": o.get("organization", ""),
            "description": o.get("description", "")
        })
    return normalized
