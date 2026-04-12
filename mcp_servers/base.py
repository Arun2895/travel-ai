"""
Base class for all MCP tool servers in this project.
"""

import logging
import httpx
from abc import ABC

logger = logging.getLogger(__name__)


class BaseMCPServer(ABC):
    """Shared async HTTP client and error handling for all MCP servers."""

    def __init__(self, base_url: str, default_headers: dict | None = None):
        self.base_url = base_url
        self._headers = default_headers or {}
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                headers=self._headers,
                timeout=30.0,
            )
        return self._client

    async def _request(self, method: str, path: str, params: dict | None = None, data: dict | None = None, headers: dict | None = None) -> dict:
        client = await self._get_client()
        try:
            req_headers = {**self._headers, **(headers or {})}
            kwargs = {"params": params, "headers": req_headers}
            
            if data:
                if req_headers.get("Content-Type") == "application/x-www-form-urlencoded":
                    kwargs["data"] = data
                else:
                    kwargs["json"] = data
            
            response = await client.request(method, path, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error {e.response.status_code} on {method} {path}: {e.response.text}")
            return {"error": str(e), "status_code": e.response.status_code}
        except Exception as e:
            logger.error(f"Request failed on {method} {path}: {e}")
            return {"error": str(e)}

    async def _get(self, path: str, params: dict | None = None, headers: dict | None = None) -> dict:
        return await self._request("GET", path, params=params, headers=headers)

    async def _post(self, path: str, data: dict | None = None, headers: dict | None = None) -> dict:
        # Note: Added for Amadeus OAuth
        return await self._request("POST", path, data=data, headers=headers)

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()