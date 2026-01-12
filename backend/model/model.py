from pydantic import BaseModel, EmailStr
from typing import List

#creating a model so user can create a profile
class Profile(BaseModel):
    full_name:str
    neighborhood:str
    skills:List[str]
    interest:List[str]
    availability_hours_per_week:int

class User(BaseModel):
    user_id:str # this user id is UID that we will be getting fro firebase
    email:EmailStr
    profile:Profile



#NOTE--> FOR NOW WE ARE USING USER_ID WE ARE UNIQUE ID  
#BUT LATER ON THIS WILL BE OUR UID(FIREBASE)