import hashlib
from urllib.parse import urlparse, urlunparse

def normalize_url(url: str) -> str:
    u = urlparse(url.strip())
    u = u._replace(fragment="")
    return urlunparse(u)

def make_source_id_from_url(url: str) -> str:
    norm = normalize_url(url)
    return hashlib.sha1(norm.encode("utf-8")).hexdigest()