from database.mongo import favourites_opportunities, opportunity_collection
from datetime import datetime
from model.model import Favorite
from bson import ObjectId
from fastapi import HTTPException

def save_favorite(fav: Favorite):
    doc = {
        "email": fav.email,
        "user_id": fav.user_id,
        "opportunity": ObjectId(fav.opportunity_id),
        "created_at": datetime.utcnow(),
    }
    favourites_opportunities.update_one(
        {"user_id": fav.user_id, "opportunity": ObjectId(fav.opportunity_id)},
        {"$set": doc},
        upsert=True
    )
    return {"status": "ok"}


def get_user_favorites(user_id: str):
    # Get all favorite records for this user
    favorites = list(favourites_opportunities.find({"user_id": user_id}))
    print(f"Found {len(favorites)} favorites for user {user_id}")
    
    if not favorites:
        return []
    
    results = []
    for fav in favorites:
        print(f"Looking up opportunity: {fav['opportunity']}")
        
        # Fetch the corresponding opportunity
        opp = opportunity_collection.find_one({"_id": fav["opportunity"]})
        
        if opp:
            opp["_id"] = str(opp["_id"])
            results.append(opp)
            print(f"Found opportunity: {opp.get('title', 'No title')}")
        else:
            print(f"Opportunity {fav['opportunity']} not found in opportunities collection")
    
    print(f"Returning {len(results)} opportunities")
    return results


## How to Call the Endpoint:


def get_opportunity(opportunity_id: str):
    try:
        # Convert string ID to ObjectId
        obj_id = ObjectId(opportunity_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")

    # Fetch opportunity from MongoDB
    opp = opportunity_collection.find_one({"_id": obj_id})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Convert ObjectId to string for frontend use
    opp["_id"] = str(opp["_id"])

    # Optional: Remove any internal fields that frontend doesn't need
    # e.g., opp.pop("_internal_field", None)

    return opp

def delete_opportunity_fav(user_id: str, opportunity_id: str):
    result = favourites_opportunities.delete_one({
        "user_id": user_id,
        "opportunity": ObjectId(opportunity_id)
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"status": "success", "message": "Favorite removed"}
