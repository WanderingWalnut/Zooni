from __future__ import annotations

import html
import os
from typing import Optional

from dotenv import load_dotenv

from .crypto import decrypt_phone, encrypt_phone, is_hash_mode
from .db import get_conn, insert_event, now_ts

load_dotenv()

try:
    from twilio.rest import Client  # type: ignore
except Exception:  # pragma: no cover - optional during local tests
    Client = None  # type: ignore

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID") or ""
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN") or ""
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER") or ""


JOIN_REPLY = (
    "You're in! We'll text you when shifts drop. Reply SHORT anytime for links."
)
HELP_REPLY = (
    "Zooni: JOIN to opt in, STOP to opt out, SHORT for links. Msg&data rates may apply."
)
STOP_REPLY = "You’ve been opted out. Reply JOIN to opt back in."


def short_links_reply(base_url: str) -> str:
    return (
        f"Helpful links → EWA: {base_url}/ewa | Perks: {base_url}/perks | Shifts: {base_url}/shifts"
    )


def build_twiml_message(body: str) -> str:
    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        f"<Response><Message>{html.escape(body)}</Message></Response>"
    )


def _twilio_client() -> Optional[Client]:
    if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and Client):
        return None
    try:
        return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception:
        return None


def send_sms(to: str, body: str) -> bool:
    insert_event("sms_outbound", {"to": to, "body": body})
    client = _twilio_client()
    if not client or not TWILIO_NUMBER:
        return False
    try:
        client.messages.create(to=to, from_=TWILIO_NUMBER, body=body)
        return True
    except Exception as e:
        insert_event("sms_send_error", {"to": to, "error": str(e)})
        return False


def save_or_update_user(phone_e164: str) -> None:
    token = encrypt_phone(phone_e164)
    with get_conn() as conn:
        if is_hash_mode():
            existing = conn.execute(
                "SELECT id FROM users WHERE phone_enc = ?",
                (token,),
            ).fetchone()
            if existing:
                return
            conn.execute(
                "INSERT INTO users (phone_enc, consent_ts) VALUES (?, ?)",
                (token, now_ts()),
            )
        else:
            rows = conn.execute("SELECT id, phone_enc FROM users").fetchall()
            for row in rows:
                if decrypt_phone(row["phone_enc"]) == phone_e164:
                    return
            conn.execute(
                "INSERT INTO users (phone_enc, consent_ts) VALUES (?, ?)",
                (token, now_ts()),
            )


def remove_user(phone_e164: str) -> int:
    token = encrypt_phone(phone_e164)
    with get_conn() as conn:
        if is_hash_mode():
            cur = conn.execute("DELETE FROM users WHERE phone_enc = ?", (token,))
            return cur.rowcount
        removed = 0
        rows = conn.execute("SELECT id, phone_enc FROM users").fetchall()
        for row in rows:
            if decrypt_phone(row["phone_enc"]) == phone_e164:
                conn.execute("DELETE FROM users WHERE id = ?", (row["id"],))
                removed += 1
        return removed
