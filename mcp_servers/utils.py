import os
import json
import logging
from pathlib import Path
import httpx
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

logger = logging.getLogger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org"
OVERPASS_URL = "https://overpass.kumi.systems/api"
HEADERS = {"User-Agent": "TravelAI-Assistant-Project/1.0"}

CACHE_FILE = Path(__file__).parent.parent / ".cache" / "geocoding.json"


class GeocodingCache:
    def __init__(self, cache_path: Path):
        self.cache_path = cache_path
        self._cache = {}
        self.load()

    def load(self):
        if self.cache_path.exists():
            try:
                self._cache = json.loads(self.cache_path.read_text())
            except Exception as e:
                logger.error(f"Failed to load cache: {e}")

    def save(self):
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            self.cache_path.write_text(json.dumps(self._cache, indent=2))
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")

    def get(self, location: str):
        return self._cache.get(location.lower())

    def set(self, location: str, lat: float, lon: float):
        self._cache[location.lower()] = {"lat": lat, "lon": lon}
        self.save()


_geo_cache = GeocodingCache(CACHE_FILE)


@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(3),
    retry=retry_if_exception_type(httpx.HTTPError)
)
async def safe_get(url: str, params: dict):
    async with httpx.AsyncClient(headers=HEADERS, timeout=30) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


async def get_coordinates(location: str):
    """Geocode a location using cache or Nominatim API with retries."""
    cached = _geo_cache.get(location)
    if cached:
        return cached["lat"], cached["lon"]

    try:
        data = await safe_get(f"{NOMINATIM_URL}/search", {"q": location, "format": "json", "limit": 1})
        if not data:
            return None, None
        lat, lon = data[0]["lat"], data[0]["lon"]
        _geo_cache.set(location, lat, lon)
        return lat, lon
    except Exception as e:
        logger.error(f"Geocoding failed for {location}: {e}")
        return None, None


async def execute_overpass_query(query: str) -> dict:
    """Execute Overpass query with retries."""
    try:
        return await safe_get(f"{OVERPASS_URL}/interpreter", {"data": query})
    except Exception as e:
        logger.error(f"Overpass query failed: {e}")
        return {}

