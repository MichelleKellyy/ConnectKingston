from database.mongo import favourites_opportunities
from datetime import datetime
from model.model import Favorite
from bson import ObjectId

async def save_favorite(fav: Favorite):
    doc = {
        "email": fav.email,
        "opportunity_id": ObjectId(fav.opportunity_id),
        "created_at": datetime.utcnow(),
    }
    await favourites_opportunities.update_one(
        {"user_id": fav.user_id, "opportunity_id": ObjectId(fav.opportunity_id)},
        {"$set": doc},
        upsert=True
    )
    return {"status": "ok"}

async def get_user_favorites(user_id: str):
    cursor = favourites_opportunities.find({"user_id": user_id})
    favorites = []
    async for doc in cursor:
        favorites.append({
            "opportunity_id": str(doc["opportunity_id"]),  # convert ObjectId to string
            "saved_at": doc["created_at"],
        })
    return favorites

