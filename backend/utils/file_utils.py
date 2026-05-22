"""
Utility helpers for JSON file handling.
Includes self-healing relative path resolution for multi-directory environments.
"""

import json
from pathlib import Path
from typing import Any

# Dynamically compute the project root directory (C:\Users\...\Jansathi-AI)
# from backend/utils/file_utils.py, the root is three levels up.
PROJECT_ROOT = Path(__file__).parent.parent.parent.resolve()


def read_json_file(file_path: str) -> Any:
    """
    Reads JSON file safely. Automatically resolves relative paths 
    to the project root if they are not found in the current working directory.

    Args:
        file_path: Path to JSON file (absolute or relative)

    Returns:
        Parsed JSON data
    """
    path = Path(file_path)

    # Self-healing relative path resolution
    if not path.is_absolute() and not path.exists():
        alternative_path = PROJECT_ROOT / file_path
        if alternative_path.exists():
            path = alternative_path

    if not path.exists():
        raise FileNotFoundError(
            f"Database file not found: {file_path}. "
            f"Searched locally and at root: {path}"
        )

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def write_json_file(file_path: str, data: Any) -> None:
    """
    Writes data to JSON file. Automatically resolves relative paths 
    to the project root if the parent folder exists there.

    Args:
        file_path: Path to JSON file
        data: Data to save
    """
    path = Path(file_path)

    # Self-healing relative path resolution
    if not path.is_absolute() and not path.exists():
        alternative_path = PROJECT_ROOT / file_path
        if alternative_path.parent.exists():
            path = alternative_path

    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)