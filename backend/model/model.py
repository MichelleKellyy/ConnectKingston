from pydantic import BaseModel, EmailStr, Field
from typing import List

class Profile(BaseModel):
    full_name: str = Field(
        ..., 
        min_length=1, 
        max_length=100, 
        description="User's full name (max length 100)"
    )
    neighborhood: str = Field(
        ..., 
        min_length=1, 
        max_length=50, 
        description="Neighborhood in Kingston (max length 50)"
    )
    postal_code: str = Field(
        ..., 
        min_length=3, 
        max_length=10, 
        description="Postal code (mandatory, e.g. K7L 0A1)"
    )
    skills: List[str] = Field(..., description="List of skills")
    interests: List[str] = Field(..., description="List of interests")
    availability_hours_per_week: str= Field(
        ..., 
        ge=1, 
        le=168, 
        description="Availability hours per week (0-168)"
    )

class User(BaseModel):
    user_id: str = Field(..., description="Firebase UID")
    email: EmailStr = Field(..., description="User email")
    profile: Profile
