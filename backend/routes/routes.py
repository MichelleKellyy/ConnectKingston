import controller.controller as helper
from fastapi import APIRouter, Path
from model.model import User

router = APIRouter()

# ---------------- GET default message ----------------
@router.get('/')
def default_Msg():
    return helper.default_msg()

# ---------------- CREATE USER ----------------
@router.post('/create_user')
def createUser(user: User):
    return helper.create_user(user)

# ---------------- UPDATE USER ----------------
@router.put('/update_user/{user_id}')
def updateUser(user_id: str = Path(..., description="ID of the user to update"), updated_user: User = ...):
    return helper.update_user(user_id, updated_user)

# ---------------- DELETE USER ----------------
@router.delete('/delete_user/{user_id}')
def deleteUser(user_id: str = Path(..., description="ID of the user to delete")):
    return helper.delete_user(user_id)
