from __future__ import annotations

from typing import Dict, Tuple

from .db import get_conn, now_ts


def week_window() -> Tuple[int, int]:
    end_ts = now_ts()
    start_ts = end_ts - 7 * 24 * 3600
    return start_ts, end_ts


essential_event_types = [
    "shortfall",
    "chose_ewa",
    "chose_shift",
    "chose_perk",
]


def weekly_counts() -> Dict[str, int]:
    start_ts, end_ts = week_window()
    with get_conn() as conn:
        def count(event_type: str) -> int:
            row = conn.execute(
                "SELECT COUNT(*) AS c FROM events WHERE ts BETWEEN ? AND ? AND type = ?",
                (start_ts, end_ts, event_type),
            ).fetchone()
            return int(row["c"] if row else 0)

        return {
            "shortfall_count": count("shortfall"),
            "chose_ewa_count": count("chose_ewa"),
            "chose_shift_count": count("chose_shift"),
            "chose_perk_count": count("chose_perk"),
        }


def financial_stress_index() -> int:
    counts = weekly_counts()
    shortfall = counts["shortfall_count"]
    with get_conn() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM users").fetchone()
        users_total = int(row["c"] if row else 0)
    if users_total <= 0:
        return 0
    return int(round(100 * shortfall / users_total))
