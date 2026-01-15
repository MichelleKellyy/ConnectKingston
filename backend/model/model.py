from pydantic import BaseModel, EmailStr, Field
from typing import List

class Profile(BaseModel):
    full_name: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="User's full name (max length 100)"
    )
    postal_code: str = Field(
        ..., 
        min_length=7, 
        max_length=7, 
        description="Postal code (mandatory, e.g. K7L 0A1)"
    )
    skills: List[str] = Field(..., min_length=1,description="List of skills")
    interests: List[str] = Field(...,min_length=1, description="List of interests")
    availability_hours_per_week: str= Field(
        ..., 
        min_length=7, 
        description="Availability hours per week (0-168)"
    )

class User(BaseModel):
    user_id:str # this user id is UID that we will be getting fro firebase
    email:str
    profile:Profile
    user_id: str = Field(..., description="Firebase UID")
    email: EmailStr = Field(..., description="User email")
    profile: Profile
