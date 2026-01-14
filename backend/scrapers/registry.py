from typing import Callable, Dict, List, Any

from scrapers.sources.cityofkingston import scrape_city_of_kingston_volunteering

# A scraper returns a list of opportunity dicts
ScrapeFn = Callable[[], List[Dict[str, Any]]]

REGISTRY: Dict[str, ScrapeFn] = {
    # key = source name used in URLs and stored in Mongo
    "cityofkingston": scrape_city_of_kingston_volunteering,
}

def list_sources() -> List[str]:
    """Return available scraper source keys."""
    return sorted(REGISTRY.keys())

def get_scraper(source: str) -> ScrapeFn:
    """Get a scraper function by source key."""
    if source not in REGISTRY:
        raise KeyError(f"Unknown source '{source}'. Available: {list_sources()}")
    return REGISTRY[source]