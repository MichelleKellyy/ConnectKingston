from bs4 import BeautifulSoup
from typing import Any, Dict, List

from ..http import fetch_text
from ..utils import _make_source_id

SOURCE = "youthdiversion"
LIST_URL = "https://www.youthdiversion.org/volunteer/"

def scrape_youthdiversion() -> List[Dict[str, Any]]:
    html = fetch_text(LIST_URL)
    soup = BeautifulSoup(html, "lxml")

    docs: List[Dict[str, Any]] = []

    # 1) Anchor on the section heading
    heading = soup.find(
        lambda tag: tag.name in ("h2", "h3")
        and "volunteer positions" in tag.get_text(" ", strip=True).lower()
    )
    if not heading:
        return []

    col = heading.find_parent("div", class_="vc_column-inner")
    if not col:
        return []

    # 2) Grab candidate paragraphs in this column
    item_nodes = col.select("p.p1")
    if not item_nodes:
        return []

    # 3) Parse roles
    for i, node in enumerate(item_nodes):
        b = node.find("b")
        if not b:
            continue  # skips the contact paragraph etc.

        title = b.get_text(" ", strip=True).strip()
        if not title:
            continue

        title_text = title.rstrip(":").strip()
        full_text = node.get_text(" ", strip=True)

        # A) Try to get description from same paragraph by removing the title prefix
        desc = full_text
        for prefix in (f"{title_text}:", f"{title_text} :", title_text):
            if desc.startswith(prefix):
                desc = desc[len(prefix):].strip()
                break
        desc = desc.strip(" :")

        # B) Special case: title-only paragraph (e.g., "Youth Justice Volunteers:")
        #    If there's no description left, take the next paragraph if it's not another bold-title item.
        if not desc and i + 1 < len(item_nodes):
            nxt = item_nodes[i + 1]
            if not nxt.find("b"):
                desc = nxt.get_text(" ", strip=True).strip()

        if not desc:
            continue

        apply_url = LIST_URL 

        doc: Dict[str, Any] = {
            "source": SOURCE,
            "source_id": _make_source_id(LIST_URL, title_text),
            "title": title_text,
            "organization": "Youth Diversion",
            "description": desc,
            "location_text": "Kingston, ON",
            "apply_url": apply_url,
            "page_url": LIST_URL,
            "raw": {
                "page_url": LIST_URL,
                "apply_url": apply_url,
                "node_html": str(node)[:4000],
                "parsed": {
                    "title": title_text,
                    "description": desc,
                    "apply_url": apply_url,
                },
            },
        }
        docs.append(doc)

    # 4) In-run de-dupe
    unique: dict[tuple[str, str], Dict[str, Any]] = {}
    for d in docs:
        unique[(d["source"], d["source_id"])] = d

    return list(unique.values())