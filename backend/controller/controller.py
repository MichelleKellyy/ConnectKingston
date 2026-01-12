from model.model import User
from database.mongo import user_collection
from fastapi import HTTPException

def default_msg():
    return "Welcome to backend"

# ---------------- CREATE USER ----------------
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


# ---------------- UPDATE USER ----------------
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


# ---------------- DELETE USER ----------------
def delete_user(user_id: str):
    try:
        result = user_collection.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User deleted successfully"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(error)}")
