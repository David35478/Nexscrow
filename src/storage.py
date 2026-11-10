"""Tiny thread-safe JSON storage with /tmp fallback."""

from __future__ import annotations

import json
import os
import tempfile
import threading
from pathlib import Path
from typing import Any, Callable


def utcnow() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).isoformat()


def _writable(path: Path) -> bool:
    try:
        path.mkdir(parents=True, exist_ok=True)
        probe = path / ".write-probe"
        probe.write_text("ok")
        probe.unlink()
        return True
    except OSError:
        return False


class JsonStore:
    """Persist each collection as one JSON file, safe for concurrent access."""

    def __init__(self, base_dir: str | Path | None = None):
        if base_dir is not None:
            root = Path(base_dir)
        elif os.environ.get("NEXSCROW_DATA_DIR"):
            root = Path(os.environ["NEXSCROW_DATA_DIR"])
        else:
            local = Path("data")
            root = local if _writable(local) else Path(tempfile.gettempdir()) / "nexscrow"
        root.mkdir(parents=True, exist_ok=True)
        self.root = root
        self._lock = threading.Lock()

    def _path(self, name: str) -> Path:
        return self.root / f"{name}.json"

    def _read(self, name: str, default: Any) -> Any:
        path = self._path(name)
        if not path.exists():
            return default
        try:
            return json.loads(path.read_text())
        except (json.JSONDecodeError, OSError):
            return default

    def _write(self, name: str, data: Any) -> None:
        path = self._path(name)
        tmp = path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(data, indent=2, default=str))
        os.replace(tmp, path)

    def read(self, name: str, default: Any) -> Any:
        with self._lock:
            return self._read(name, default)

    def write(self, name: str, data: Any) -> None:
        with self._lock:
            self._write(name, data)

    def update(self, name: str, default: Any, mutate: Callable[[Any], Any]) -> Any:
        """Atomically read-mutate-write a collection and return mutate's result."""
        with self._lock:
            data = self._read(name, default)
            result = mutate(data)
            self._write(name, data)
            return result
