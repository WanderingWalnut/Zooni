from __future__ import annotations

import hashlib
import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

try:
    from cryptography.fernet import Fernet  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    Fernet = None  # type: ignore

FERNET_KEY = os.getenv("FERNET_KEY") or ""
_has_fernet_lib = Fernet is not None
_fernet: Optional["Fernet"] = None

if FERNET_KEY and _has_fernet_lib:
    try:
        _fernet = Fernet(FERNET_KEY.encode("utf-8"))
    except Exception:
        _fernet = None

# True when only hashing is available; in this mode broadcast is disabled
DEMO_HASH_MODE = _fernet is None


def is_hash_mode() -> bool:
    return DEMO_HASH_MODE


def encrypt_phone(e164: str) -> str:
    if DEMO_HASH_MODE:
        return hashlib.sha256(e164.encode("utf-8")).hexdigest()
    assert _fernet is not None
    token = _fernet.encrypt(e164.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_phone(token: str) -> Optional[str]:
    if DEMO_HASH_MODE:
        return None
    assert _fernet is not None
    try:
        return _fernet.decrypt(token.encode("utf-8")).decode("utf-8")
    except Exception:
        return None
