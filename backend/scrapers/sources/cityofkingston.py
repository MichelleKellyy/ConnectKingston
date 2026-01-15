from bs4 import BeautifulSoup
from typing import Any, Dict, List
from urllib.parse import urljoin

from ..http import fetch_text
from ..utils import make_source_id_from_url, normalize_url

SOURCE = "cityofkingston"
LIST_URL = "https://www.cityofkingston.ca/careers-and-volunteering/volunteering/"

FILLED_PHRASES = (
    "this volunteer position is currently filled",
    "position is currently filled",
    "currently filled",
    "no longer available",
    "this opportunity is closed",
)

def is_filled_opportunity(detail_url: str) -> bool:
    """
    Fetch the detail page and detect a 'filled/closed' banner/message.
    Returns True if it's filled/closed, else False.
    """
    try:
        html = fetch_text(detail_url)
    except Exception:
        #Fail-open
        return False

    soup = BeautifulSoup(html, "lxml")

    # 1) Target the common alert box container if present
    alert = soup.select_one("section.kingston-alert-box")
    if alert:
        text = alert.get_text(" ", strip=True).lower()
        return any(p in text for p in FILLED_PHRASES)


def scrape_city_of_kingston_volunteering() -> List[Dict[str, Any]]:
    html = fetch_text(LIST_URL)
    soup = BeautifulSoup(html, "lxml")

    heading = soup.find(
        lambda tag: tag.name in ("h2", "h3")
        and "current volunteer opportunities" in tag.get_text(strip=True).lower()
    )
    if not heading:
        return []

    section = heading
    for _ in range(4):
        if section and section.name in ("section", "div", "main"):
            if section.select_one("p.heading.sm.c3-heading"):
                break
        section = section.parent

    if not section:
        return []

    title_nodes = section.select("p.heading.sm.c3-heading")
    if not title_nodes:
        return []

    docs: List[Dict[str, Any]] = []

    for title_node in title_nodes:
        card = title_node
        for _ in range(6):
            if card.name in ("article", "li", "div", "section"):
                if card.select_one("a[href]"):
                    break
            card = card.parent

        title = title_node.get_text(" ", strip=True)

        desc = None
        desc_node = card.select_one("div.text.c3-text") if card else None
        if desc_node:
            desc = desc_node.get_text(" ", strip=True)

        apply_url = None
        link = card.select_one("a[href]") if card else None
        if link and link.get("href"):
            apply_url = normalize_url(urljoin(LIST_URL, link.get("href").strip()))
        if not apply_url:
            continue

        if is_filled_opportunity(apply_url):
            continue

        doc: Dict[str, Any] = {
            "source": SOURCE,
            "source_id": make_source_id_from_url(apply_url),
            "title": title,
            "organization": "City of Kingston",
            "description": desc,
            "location_text": "Kingston, ON",
            "apply_url": apply_url,
            "raw": {
                "list_url": LIST_URL,
                "card_title_html": str(title_node)[:2000],
                "card_desc_html": str(desc_node)[:2000] if desc_node else None,
                "card_html": str(card)[:4000] if card else None,
                "parsed": {
                    "title": title,
                    "description": desc,
                    "apply_url": apply_url,
                },
            },
        }
        docs.append(doc)

    unique: dict[tuple[str, str], Dict[str, Any]] = {}
    for d in docs:
        unique[(d["source"], d["source_id"])] = d

    return list(unique.values())