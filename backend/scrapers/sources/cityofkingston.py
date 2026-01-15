from bs4 import BeautifulSoup
from typing import Any, Dict, List
from urllib.parse import urljoin

from ..http import fetch_text
from ..utils import make_source_id_from_url, normalize_url

SOURCE = "cityofkingston"
LIST_URL = "https://www.cityofkingston.ca/careers-and-volunteering/volunteering/"


def scrape_city_of_kingston_volunteering() -> List[Dict[str, Any]]:
    html = fetch_text(LIST_URL)
    soup = BeautifulSoup(html, "lxml")

    heading = soup.find(
        lambda tag: tag.name in ("h2", "h3")
        and "current volunteer opportunities" in tag.get_text(strip=True).lower()
    )
    if not heading:
        return []

    # 1) Find the section container that holds the cards
    # We'll walk upward a bit to a reasonable container, then search within it.
    section = heading
    for _ in range(4):
        if section and section.name in ("section", "div", "main"):
            # heuristic: stop if this container contains at least one title element
            if section.select_one("p.heading.sm.c3-heading"):
                break
        section = section.parent

    if not section:
        return []

    # 2) Each opportunity card should contain a title element.
    # We'll treat the closest repeated parent of that title as the "card".
    title_nodes = section.select("p.heading.sm.c3-heading")
    if not title_nodes:
        return []

    docs: List[Dict[str, Any]] = []

    for title_node in title_nodes:
        # Find a reasonable card container by climbing up from the title.
        card = title_node
        for _ in range(6):
            if card.name in ("article", "li", "div", "section"):
                # If this container also has a link, it's a good candidate
                if card.select_one("a[href]"):
                    break
            card = card.parent

        # Extract title text
        title = title_node.get_text(" ", strip=True)

        # Extract description (teaser) text
        desc = None
        desc_node = card.select_one("div.text.c3-text") if card else None
        if desc_node:
            desc = desc_node.get_text(" ", strip=True)

        # Extract the best URL (apply_url)
        apply_url = None
        link = card.select_one("a[href]") if card else None
        if link and link.get("href"):
            apply_url = normalize_url(urljoin(LIST_URL, link.get("href").strip()))

        # If no URL, skip (because source_id depends on URL)
        if not apply_url:
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

    # 3) De-dupe in-run
    unique: dict[tuple[str, str], Dict[str, Any]] = {}
    for d in docs:
        unique[(d["source"], d["source_id"])] = d

    return list(unique.values())
