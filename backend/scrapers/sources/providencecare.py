from bs4 import BeautifulSoup
from typing import Any, Dict, List
import hashlib

from ..http import fetch_text
from ..utils import normalize_url

SOURCE = "providencecare"
PAGE_URL = "https://providencecare.ca/careers-volunteering/volunteer/"

def _make_source_id(page_url: str, role_title: str) -> str:
    base = normalize_url(page_url)
    key = f"{base}::{role_title.strip().lower()}"
    return hashlib.sha1(key.encode("utf-8")).hexdigest()

def _is_header_row(tr) -> bool:
    # If the row has <th>, it's a header row
    if tr.find("th"):
        return True
    # If all cells are bold-ish, also treat as header
    tds = tr.find_all("td")
    if not tds:
        return True
    text = " ".join(td.get_text(" ", strip=True) for td in tds)
    if not text:
        return True
    return False

def scrape_providencecare_volunteer() -> List[Dict[str, Any]]:
    html = fetch_text(PAGE_URL)
    soup = BeautifulSoup(html, "lxml")

    # 1) Anchor on the section where the opportunities live
    heading = soup.find(
        lambda tag: tag.name in ("h2", "h3")
        and "current volunteering opportunities" in tag.get_text(strip=True).lower()
    )
    if not heading:
        return []

    docs: List[Dict[str, Any]] = []
    current_group_title: str | None = None

    # 2) Walk forward through the DOM. This naturally handles:
    #    - multiple tables
    #    - headers between tables
    #    - breaks / paragraphs in between
    node = heading
    while True:
        node = node.find_next()
        if not node:
            break

        # Stop once we hit the next major section (another H2)
        if node.name == "h2":
            break

        # Track section headers that might appear between tables
        if node.name in ("h3", "h4"):
            current_group_title = node.get_text(" ", strip=True)
            continue

        # Parse every table we encounter
        if node.name == "table":
            for tr in node.find_all("tr"):
                if _is_header_row(tr):
                    continue

                # collect td text
                tds = tr.find_all("td")
                if len(tds) < 3:
                    continue

                cells = [td.get_text(" ", strip=True) for td in tds]
                cells = [c for c in cells if c]
                if len(cells) < 3:
                    continue

                role_title = cells[0]
                availability = cells[1]
                desc = " ".join(cells[2:])

                # Basic guards
                if not role_title or not desc:
                    continue

                doc: Dict[str, Any] = {
                    "source": SOURCE,
                    "source_id": _make_source_id(PAGE_URL, role_title),
                    "title": role_title,
                    "organization": "Providence Care",
                    "description": current_group_title + ": " + desc if current_group_title else desc,
                    "location_text": "Kingston, ON",
                    "apply_url": PAGE_URL,
                    "raw": {
                        "page_url": PAGE_URL,
                        "group": current_group_title,     # header between tables
                        "availability": availability,     # the middle cell
                        "cells": cells,                   # debugging
                        "row_html": str(tr)[:4000],
                        "parsed": {
                            "title": role_title,
                            "availability": availability,
                            "description": desc,
                        },
                    },
                }
                docs.append(doc)

    # 3) In-run de-dupe
    unique: dict[tuple[str, str], Dict[str, Any]] = {}
    for d in docs:
        unique[(d["source"], d["source_id"])] = d
    return list(unique.values())
