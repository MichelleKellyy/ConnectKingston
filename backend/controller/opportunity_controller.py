from typing import Any, Dict, List
import time

from scrapers.registry import get_scraper, list_sources
from database.opportunity import upsert_opportunity, delete_missing_for_source

MIN_EXPECTED_ITEMS = 1

def ingest_source(source: str) -> Dict[str, Any]:
    """
    Run a single scraper by source name, upsert each result into MongoDB,
    then delete any previously-stored docs for that source that were NOT
    seen in this run (Option A).

    Returns a summary for debugging/demo.
    """
    scrape_fn = get_scraper(source)

    start = time.time()
    docs: List[Dict[str, Any]] = scrape_fn()

    upserted = 0
    deleted_missing = 0
    errors: List[str] = []
    seen_source_ids: List[str] = []

    # ---- Safety guard: avoid accidental wipe if scrape breaks ----
    # If docs is None or unexpectedly empty, skip deletion step.
    if docs is None:
        return {
            "source": source,
            "found": 0,
            "upserted": 0,
            "deleted_missing": 0,
            "skipped_reconcile": True,
            "reason": "Scraper returned None; skipping deletion to avoid wipe",
            "errors": ["scraper returned None"],
            "available_sources": list_sources(),
            "duration_sec": round(time.time() - start, 3),
        }

    if len(docs) < MIN_EXPECTED_ITEMS:
        # Still allow upserts (there are none), but do NOT delete everything.
        return {
            "source": source,
            "found": len(docs),
            "upserted": 0,
            "deleted_missing": 0,
            "skipped_reconcile": True,
            "reason": f"Only {len(docs)} items scraped; skipping deletion to avoid wipe",
            "errors": [],
            "available_sources": list_sources(),
            "duration_sec": round(time.time() - start, 3),
        }

    # ---- Upsert all docs and track which source_ids we saw ----
    for doc in docs:
        try:
            upsert_opportunity(doc)
            upserted += 1

            sid = doc.get("source_id")
            if sid:
                seen_source_ids.append(sid)
        except Exception as e:
            errors.append(str(e))

    # ---- Delete anything for this source not seen in this run ----
    try:
        deleted_missing = delete_missing_for_source(source, seen_source_ids)
    except Exception as e:
        errors.append(f"delete_missing_for_source failed: {e}")

    return {
        "source": source,
        "found": len(docs),
        "upserted": upserted,
        "deleted_missing": deleted_missing,
        "seen_ids": len(seen_source_ids),
        "skipped_reconcile": False,
        "errors": errors[:20],
        "available_sources": list_sources(),
        "duration_sec": round(time.time() - start, 3),
    }


def ingest_all() -> Dict[str, Any]:
    """
    Run all registered scrapers and upsert results.
    After each source run, delete any docs missing from that source's latest scrape.
    """
    results: List[Dict[str, Any]] = []
    total_found = 0
    total_upserted = 0
    total_deleted_missing = 0
    total_skipped_reconcile = 0

    sources = list_sources()

    for source in sources:
        r = ingest_source(source)
        results.append(r)

        total_found += r.get("found", 0)
        total_upserted += r.get("upserted", 0)
        total_deleted_missing += r.get("deleted_missing", 0)
        if r.get("skipped_reconcile"):
            total_skipped_reconcile += 1

        # polite small delay between websites
        time.sleep(0.6)

    return {
        "sources": sources,
        "total_found": total_found,
        "total_upserted": total_upserted,
        "total_deleted_missing": total_deleted_missing,
        "sources_skipped_reconcile": total_skipped_reconcile,
        "results": results,
    }