import httpx

DEFAULT_HEADERS = {
    "User-Agent": "ConnectKingston",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def fetch_text(url: str) -> str:
    with httpx.Client(timeout=20.0, headers=DEFAULT_HEADERS, follow_redirects=True) as client:
        r = client.get(url)
        r.raise_for_status()
        return r.text