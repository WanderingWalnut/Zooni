from __future__ import annotations

import json
import os
import sqlite3
import time
from pathlib import Path
from typing import Any, Dict

from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv("DB_PATH", "zooni.db")


def get_db_path() -> str:
    path = DB_PATH
    if not os.path.isabs(path):
        base_dir = Path(__file__).resolve().parents[1]
        return str(base_dir / path)
    return path


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def now_ts() -> int:
    return int(time.time())


def init_db() -> None:
    models_sql_path = Path(__file__).with_name("models.sql")
    with open(models_sql_path, "r", encoding="utf-8") as f:
        sql = f.read()
    with get_conn() as conn:
        conn.executescript(sql)


def insert_event(event_type: str, meta: Dict[str, Any]) -> None:
    record = {
        "ts": now_ts(),
        "type": event_type,
        "meta_json": json.dumps(meta, separators=(",", ":"), ensure_ascii=False),
    }
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO events (ts, type, meta_json) VALUES (?, ?, ?)",
            (record["ts"], record["type"], record["meta_json"]),
        )
