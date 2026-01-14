from typing import Any, Dict, List
import time

from scrapers.registry import get_scraper, list_sources
from database.opportunity import upsert_opportunity


def ingest_source(source: str) -> Dict[str, Any]:
    """
    Run a single scraper by source name, then upsert each result into MongoDB.
    Returns a summary for debugging/demo.
    """
    scrape_fn = get_scraper(source)  # lookup the correct scraper function

    start = time.time()
    docs: List[Dict[str, Any]] = scrape_fn()

    upserted = 0
    errors: List[str] = []

    for doc in docs:
        try:
            upsert_opportunity(doc)
            upserted += 1
        except Exception as e:
            # Keep going even if one record fails
            errors.append(str(e))

    return {
        "source": source,
        "found": len(docs),
        "upserted": upserted,
        "errors": errors[:20],
        "available_sources": list_sources(),  # helpful in demo/debug
        "duration_sec": round(time.time() - start, 3),
    }


def ingest_all() -> Dict[str, Any]:
    """
    Run all registered scrapers and upsert results.
    """
    results: List[Dict[str, Any]] = []
    total_found = 0
    total_upserted = 0

    for source in list_sources():
        r = ingest_source(source)
        results.append(r)
        total_found += r["found"]
        total_upserted += r["upserted"]

        # polite small delay between websites
        time.sleep(0.6)

    return {
        "sources": list_sources(),
        "total_found": total_found,
        "total_upserted": total_upserted,
        "results": results,
    }