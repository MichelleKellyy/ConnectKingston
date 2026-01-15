from pymongo import ASCENDING
from datetime import datetime
from typing import Dict, Any, List

from database.mongo import opportunity_collection as opportunities

def ensure_opportunity_indexes():
    opportunities.create_index(
        [("source", ASCENDING), ("source_id", ASCENDING)],
        unique=True,
        name="uniq_source_sourceid"
    )

def upsert_opportunity(doc: Dict[str, Any]) -> None:
    doc["fetched_at"] = datetime.utcnow()
    opportunities.update_one(
        {"source": doc["source"], "source_id": doc["source_id"]},
        {"$set": doc},
        upsert=True
    )
    print("upserted_id:")

def list_opportunities(limit: int = 100) -> list[dict]:
    pipeline = [
        {"$sort": {"fetched_at": -1}},
        {"$limit": limit},
        {"$addFields": {"_id": {"$toString": "$_id"}}},
    ]
    return list(opportunities.aggregate(pipeline))