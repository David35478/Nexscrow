"""Load .env from the project root without a dependency.

Real environment variables (e.g. injected by Vercel) always win;
.env only fills in what is missing. Values may be wrapped in quotes.
"""

from __future__ import annotations

import os
from pathlib import Path


def load_env(path: str | Path = ".env") -> None:
    env_file = Path(path)
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        os.environ.setdefault(key.strip(), value)
