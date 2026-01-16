import hashlib
from urllib.parse import urlparse, urlunparse

def normalize_url(url: str) -> str:
    u = urlparse(url.strip())
    u = u._replace(fragment="")
    return urlunparse(u)

def make_source_id_from_url(url: str) -> str:
    norm = normalize_url(url)
    return hashlib.sha1(norm.encode("utf-8")).hexdigest()

def _make_source_id(page_url: str, role_title: str) -> str:
    base = normalize_url(page_url)
    key = f"{base}::{role_title.strip().lower()}"
    return hashlib.sha1(key.encode("utf-8")).hexdigest()