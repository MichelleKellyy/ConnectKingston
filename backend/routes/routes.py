import controller.controller as helper
from fastapi import APIRouter, Path, Query, HTTPException
from model.model import User

from controller.opportunity_controller import ingest_source, ingest_all
from scrapers.registry import list_sources
from database.opportunity import list_opportunities

router = APIRouter()

# ---------------- GET default message ----------------
@router.get("/")
def default_Msg():
    return helper.default_msg()

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

@router.get("/opportunities/unmatched")
def get_unmatched(limit: int = Query(50, ge=1, le=200)):
    items = list_opportunities(limit=limit)
    return {"items": items, "count": len(items)}