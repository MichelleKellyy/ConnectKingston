import controller.controller as helper
from fastapi import APIRouter, Path, Query, HTTPException
from model.model import User
from database.mongo import user_collection, opportunity_collection
from controller.opportunity_controller import ingest_source, ingest_all
from scrapers.registry import list_sources
from database.opportunity import list_opportunities
from utils.llm import match_with_llm_ids
from bson import ObjectId
import re
router = APIRouter()

# ---------------- GET default message ----------------
@router.get("/")
def default_Msg():
    return helper.default_msg()

@router.get('/getuser/{uid}')
def get_single_user(uid:str):
    return helper.get_user_by_id(uid)

# ---------------- CREATE USER ----------------
@router.post("/create_user")
def createUser(user: User):
    return helper.create_user(user)

# ---------------- UPDATE USER ----------------
@router.put("/update_user/{user_id}")
def updateUser(user_id: str = Path(..., description="ID of the user to update"), updated_user: User = ...):
    return helper.update_user(user_id, updated_user)

# ---------------- DELETE USER ----------------
@router.delete("/delete_user/{user_id}")
def deleteUser(user_id: str = Path(..., description="ID of the user to delete")):
    return helper.delete_user(user_id)

# ===================== INGEST ROUTES =====================

@router.get("/ingest/sources")
def get_sources():
    return {"sources": list_sources()}

@router.post("/ingest/all")
def ingest_everything():
    try:
        return ingest_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest/{source}")
def ingest_one(source: str):
    try:
        return ingest_source(source)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===================== OPPORTUNITY FEED =====================
def strip_html(text):
    return re.sub(r"<[^>]+>", "", text or "").strip()

@router.get("/opportunities/unmatched")
def get_unmatched(limit: int = Query(50, ge=1, le=200)):
    items = list_opportunities(limit=limit)
    return {"items": items, "count": len(items)}

#For LLM match results


@router.get("/match/{user_id}")
async def get_matches(user_id: str):
    # ---------------- Fetch user ----------------
    user_doc = user_collection.find_one({"user_id": user_id})
    if not user_doc:
        return {"error": "User not found"}

    # ---------------- Fetch opportunities ----------------
    opps_doc = list(opportunity_collection.find())  # fetch all opportunities

    # ---------------- Normalize user ----------------
    profile = helper.normalize_user(user_doc)

    # ---------------- Prepare opportunities for LLM ----------------
    opportunities = []
    for opp in opps_doc:
        parsed = opp.get("parsed") or {}
        raw = opp.get("raw") or {}

        opportunities.append({
        "_id": str(opp["_id"]),
        
        "title": opp.get("title") # top-level title (best)
        or parsed.get("title")          # raw.parsed.title
        or strip_html(raw.get("card_title_html"))
        or "No title",
        
        "description": parsed.get("description") or opp.get("description") or "No description provided",
        "location": opp.get("location_text", "Unknown"),
        "cause": opp.get("organization", "Unknown"),
        "availability":  parsed.get("availability")     # raw.parsed.availability (best)
        or raw.get("availability")     # raw.availability fallback
        or opp.get("availability")     # in case some docs store it top-level
        or "Not specified",
        })
        print()
    print({'profile of user that is currently logged in!!':profile})
    print()
    print()

# ---------------- Ask LLM to select IDs ----------------
    try:
        matched_ids, matched_ids_raw = await match_with_llm_ids(profile, opportunities)
        #print("Raw LLM output:", matched_ids_raw)
        print(f"matched_ids: {matched_ids}")
        print()
        print(f"matched_ids_raws: {matched_ids_raw}")
        if not isinstance(matched_ids, list):
            return {"error": "LLM did not return a list of IDs", "raw": matched_ids_raw}

    except Exception as e:
        return {"error": "LLM match failed", "details": str(e)}


# ---------------- Fetch full opportunity objects by _id ----------------
    matched_opps = []
    for _id in matched_ids:
        try:
            opp_obj = opportunity_collection.find_one({"_id": ObjectId(_id)})
            if opp_obj:
                opp_obj["_id"] = str(opp_obj["_id"])
                matched_opps.append(opp_obj)
        except Exception:
            continue  # skip invalid _id
    print({"lenght of match_opps":len(matched_opps)})
# ---------------- Return result ----------------
    return {
        "user_id": user_id,
        "raw_llm_output": matched_ids_raw,  # keep the raw output for storage/debugging
        "matches": matched_opps
    }
