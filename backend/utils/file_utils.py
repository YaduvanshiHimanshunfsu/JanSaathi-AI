"""
Utility helpers for JSON file handling.
"""

import json
from pathlib import Path
from typing import Any


def read_json_file(file_path: str) -> Any:
    """
    Reads JSON file safely.

    Args:
        file_path: Path to JSON file

    Returns:
        Parsed JSON data
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"{file_path} not found")

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def write_json_file(file_path: str, data: Any) -> None:
    """
    Writes data to JSON file.

    Args:
        file_path: Path to JSON file
        data: Data to save
    """

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)