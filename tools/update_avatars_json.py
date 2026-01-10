"""Regenerate avatars.json from files in ./avatars.
This repo's frontend expects avatars.json to be a JSON array of filenames (strings).
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
AVATAR_PNG_RE = re.compile(r"^avatar \((\d+)\)\.png$", re.IGNORECASE)


def natural_key(name: str):
    """Sort key that handles names like 'avatar (12).png' naturally."""
    parts = re.split(r"(\d+)", name)
    key = []
    for part in parts:
        if part.isdigit():
            key.append(int(part))
        else:
            key.append(part.casefold())
    return key


def _next_avatar_number(existing_filenames: list[str]) -> int:
    used: set[int] = set()
    for filename in existing_filenames:
        match = AVATAR_PNG_RE.match(filename)
        if match:
            used.add(int(match.group(1)))
    return (max(used) + 1) if used else 1


def rename_new_pngs_to_sequential(avatars_dir: Path) -> int:
    """Rename .png files to avatar (###).png if they don't already match."""
    files = [p for p in avatars_dir.iterdir() if p.is_file() and not p.name.startswith(".")]
    existing_names = [p.name for p in files]

    next_number = _next_avatar_number(existing_names)
    renamed_count = 0

    candidates = [
        p
        for p in files
        if p.suffix.lower() == ".png" and not AVATAR_PNG_RE.match(p.name)
    ]
    candidates.sort(key=lambda p: natural_key(p.name))

    for path in candidates:
        while True:
            target_name = f"avatar ({next_number}).png"
            target_path = avatars_dir / target_name
            next_number += 1
            if not target_path.exists():
                break

        path.rename(target_path)
        renamed_count += 1

    return renamed_count


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Regenerate avatars.json from files in ./avatars",
    )
    parser.add_argument(
        "--rename",
        action="store_true",
        help="Rename newly added PNGs to 'avatar (###).png' before writing avatars.json",
    )
    args = parser.parse_args(argv)

    repo_root = Path(__file__).resolve().parents[1]
    avatars_dir = repo_root / "avatars"
    out_path = repo_root / "avatars.json"

    if not avatars_dir.is_dir():
        raise SystemExit(f"Missing folder: {avatars_dir}")

    if args.rename:
        renamed = rename_new_pngs_to_sequential(avatars_dir)
        if renamed:
            print(f"Renamed {renamed} file(s) in {avatars_dir}.")

    files: list[str] = []
    for entry in avatars_dir.iterdir():
        if not entry.is_file():
            continue
        if entry.name.startswith("."):
            continue
        if entry.suffix.lower() not in SUPPORTED_EXTS:
            continue
        files.append(entry.name)

    files.sort(key=natural_key)

    out_path.write_text(json.dumps(files, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {out_path} with {len(files)} entries.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
