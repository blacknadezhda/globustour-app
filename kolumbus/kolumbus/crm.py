"""Клиент All Inclusive CRM (реальные эндпоинты из документации).

Base: api.allinclusivecrm.com/v1 · Bearer Token.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx

from .config import config

log = logging.getLogger(__name__)


class CRMError(Exception):
    pass


class CRMClient:
    def __init__(self) -> None:
        self._client = httpx.AsyncClient(
            base_url=config.crm_base_url,
            headers={"Authorization": f"Bearer {config.crm_token}"},
            timeout=20,
        )

    async def close(self) -> None:
        await self._client.aclose()

    async def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        r = await self._client.get(path, params=params)
        if r.status_code >= 400:
            raise CRMError(f"CRM GET {path} → {r.status_code}: {r.text[:300]}")
        return r.json()

    async def create_lead(
        self,
        name: str,
        phone: str,
        comment: str,
        source: str | None = None,
        user_id: str | None = None,
        price: int | None = None,
    ) -> dict[str, Any]:
        """POST /site/api/create — ядро Фазы 2. Ответ: {"id": ...}."""
        data: dict[str, Any] = {
            "name": name,
            "phone": phone,
            "comment": comment,
            "source": source or config.lead_source,
        }
        uid = user_id or config.crm_default_user_id
        if uid:
            data["userId"] = uid
        if price:
            data["finance[price]"] = price
        r = await self._client.post("/site/api/create", data=data)
        if r.status_code >= 400:
            raise CRMError(f"CRM create_lead → {r.status_code}: {r.text[:300]}")
        return r.json()

    async def get_leads(self, filters: dict[str, str] | None = None) -> Any:
        """GET /leads · /leads?filter[...] — статусы, висяки, конверсии."""
        params = {f"filter[{k}]": v for k, v in (filters or {}).items()}
        return await self._get("/leads", params or None)

    async def get_payments(self, params: dict[str, str] | None = None) -> Any:
        """GET /analytics/finance/payments — платежи по датам."""
        return await self._get("/analytics/finance/payments", params)

    async def get_users(self) -> Any:
        """GET /users — userId менеджеров для назначения лидов."""
        return await self._get("/users")

    async def get_offices(self) -> Any:
        """GET /offices."""
        return await self._get("/offices")


crm = CRMClient()
