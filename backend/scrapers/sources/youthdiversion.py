from bs4 import BeautifulSoup
from typing import Any, Dict, List
from urllib.parse import urljoin

from ..http import fetch_text
from ..utils import _make_source_id

SOURCE = "youthdiversion"
LIST_URL = "https://www.youthdiversion.org/volunteer/"

def scrape_youthdiversion() -> List[Dict[str, Any]]:
    html = fetch_text(LIST_URL)
    soup = BeautifulSoup(html, "lxml")

    docs: List[Dict[str, Any]] = []

    # 1) Find the “container” for the content you care about (anchor)
    heading = soup.find(
        lambda tag: tag.name in ("h2", "h3")
        and "volunteer positions" in tag.get_text(" ", strip=True).lower()
    )
    if not heading:
        return []

    col = heading.find_parent("div", class_="vc_column-inner")
    if not col:
        return []

    # 2) From that anchor, find the nodes that represent “items”
    item_nodes = col.select("p.p1")

    for node in item_nodes:
        b = node.find("b")
        if not b:
            continue
        title = b.get_text(" ", strip=True)

        full_text = node.get_text(" ", strip=True)
        
        desc = None
        apply_url = None

        # TODO: fill in extraction rules

        if not title or not apply_url:
            continue

        doc: Dict[str, Any] = {
            "source": SOURCE,
            "source_id": _make_source_id(LIST_URL, title),
            "title": title,
            "organization": "Youth Diversion",
            "description": desc,
            "location_text": "Kingston, ON",
            "page_url": LIST_URL,
            "raw": {
                "page_url": LIST_URL,
                "node_html": str(node)[:4000],
                "parsed": {
                    "title": title,
                    "description": desc,
                    "apply_url": apply_url,
                },
            },
        }
        ##docs.append(doc)

    # 4) In-run de-dupe
    unique: dict[tuple[str, str], Dict[str, Any]] = {}
    for d in docs:
        unique[(d["source"], d["source_id"])] = d
    ##return list(unique.values())

if __name__ == "__main__":
    scrape_youthdiversion()