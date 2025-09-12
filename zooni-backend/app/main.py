from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from .db import init_db, insert_event
from .metrics import financial_stress_index, weekly_counts
from .sms import (
    HELP_REPLY,
    JOIN_REPLY,
    STOP_REPLY,
    build_twiml_message,
    remove_user,
    save_or_update_user,
    send_sms,
    short_links_reply,
)
from .crypto import decrypt_phone, is_hash_mode

load_dotenv()

APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8000")
BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Zooni Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    init_db()


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/sms/inbound")
async def sms_inbound(request: Request) -> Response:
    form = await request.form()
    from_num = str(form.get("From", "")).strip()
    body_raw = str(form.get("Body", "")).strip()
    body = body_raw.upper()

    insert_event("sms_inbound", {"from": from_num, "body": body_raw})

    if body == "JOIN":
        save_or_update_user(from_num)
        insert_event("cmd_join", {"from": from_num})
        return Response(content=build_twiml_message(JOIN_REPLY), media_type="text/xml")

    if body in {"STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"}:
        remove_user(from_num)
        insert_event("cmd_stop", {"from": from_num})
        return Response(content=build_twiml_message(STOP_REPLY), media_type="text/xml")

    if body == "HELP":
        insert_event("cmd_help", {"from": from_num})
        return Response(content=build_twiml_message(HELP_REPLY), media_type="text/xml")

    if body == "SHORT":
        insert_event("shortfall", {"from": from_num})
        reply = short_links_reply(APP_BASE_URL)
        return Response(content=build_twiml_message(reply), media_type="text/xml")

    # Default fallback
    reply = "Zooni: Text JOIN to opt in, STOP to opt out, or SHORT for links."
    return Response(content=build_twiml_message(reply), media_type="text/xml")


@app.post("/api/choose/ewa")
async def choose_ewa() -> dict:
    insert_event("chose_ewa", {})
    return {"ok": True}


@app.post("/api/choose/shift")
async def choose_shift(request: Request) -> dict:
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    insert_event("chose_shift", {"meta": payload})
    return {"ok": True}


@app.post("/api/choose/perk")
async def choose_perk() -> dict:
    insert_event("chose_perk", {})
    return {"ok": True}


@app.get("/admin/metrics.json")
async def metrics() -> dict:
    counts = weekly_counts()
    stress = financial_stress_index()
    return {
        "stress_index_pct": stress,
        **counts,
    }


@app.post("/admin/push/shifts")
async def push_shifts() -> JSONResponse:
    if is_hash_mode():
        return JSONResponse(
            status_code=400,
            content={
                "ok": False,
                "reason": "Broadcast disabled in hash mode (no Fernet key)",
            },
        )

    # Collect recipients by decrypting stored tokens
    import sqlite3
    from .db import get_conn

    to_numbers: list[str] = []
    with get_conn() as conn:
        rows = conn.execute("SELECT phone_enc FROM users").fetchall()
        for row in rows:
            pt = decrypt_phone(row["phone_enc"])  # type: ignore[index]
            if pt:
                to_numbers.append(pt)

    if not to_numbers:
        return JSONResponse(content={"ok": True, "sent": 0})

    msg = f"Zooni: More shifts released. See what's available → {APP_BASE_URL}/shifts"
    sent = 0
    for num in to_numbers:
        if send_sms(num, msg):
            sent += 1

    # Log broadcast
    from .db import now_ts, get_conn as _gc

    with _gc() as conn:
        conn.execute(
            "INSERT INTO broadcasts (ts, kind, count_sent) VALUES (?, ?, ?)",
            (now_ts(), "shifts", sent),
        )
    insert_event("broadcast", {"kind": "shifts", "count_sent": sent})

    return JSONResponse(content={"ok": True, "sent": sent})


# Static pages

def _read_static(name: str) -> str:
    path = BASE_DIR / "static" / name
    return path.read_text(encoding="utf-8")


@app.get("/ewa")
async def ewa_page() -> HTMLResponse:
    return HTMLResponse(content=_read_static("ewa.html"))


@app.get("/perks")
async def perks_page() -> HTMLResponse:
    return HTMLResponse(content=_read_static("perks.html"))


@app.get("/shifts")
async def shifts_page() -> HTMLResponse:
    return HTMLResponse(content=_read_static("shifts.html"))


@app.get("/shifts.json")
async def shifts_json() -> JSONResponse:
    data = json.loads((BASE_DIR / "shifts.json").read_text(encoding="utf-8"))
    return JSONResponse(content=data)
