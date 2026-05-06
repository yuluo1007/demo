#!/usr/bin/env python3
"""Aggregate contributors across the agentscope-ai GitHub org into data/contributors.json.

Requires the `gh` CLI authenticated for the agentscope-ai org.

Usage:
    python3 scripts/build_contributors.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ORG = "agentscope-ai"
OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "contributors.json"


def gh(*args: str) -> bytes:
    """Run `gh api …` and return raw stdout. Raises on non-zero exit."""
    return subprocess.check_output(["gh", "api", *args])


def list_repos() -> list[str]:
    """Public, non-fork, non-archived repos in the org."""
    out = gh(
        f"orgs/{ORG}/repos?per_page=100&type=public",
        "--paginate",
        "--jq",
        ".[] | select(.archived==false and .fork==false) | .name",
    )
    return out.decode().split()


def fetch_contributors(repo: str) -> list[dict]:
    try:
        out = gh(
            f"repos/{ORG}/{repo}/contributors?per_page=100",
            "--paginate",
        )
    except subprocess.CalledProcessError as exc:
        print(f"  {repo}: skipped ({exc})", file=sys.stderr)
        return []
    if not out.strip().startswith(b"["):
        return []
    return json.loads(out)


def main() -> None:
    repos = list_repos()
    print(f"Org has {len(repos)} eligible repos.")

    agg: dict[str, dict] = defaultdict(
        lambda: {
            "login": None,
            "avatar_url": None,
            "html_url": None,
            "contributions": 0,
            "repos": [],
        }
    )

    for repo in repos:
        added = 0
        for c in fetch_contributors(repo):
            if c.get("type") != "User":
                continue
            login = c["login"]
            if login.endswith("[bot]"):
                continue
            rec = agg[login]
            rec["login"] = login
            rec["avatar_url"] = c["avatar_url"]
            rec["html_url"] = c["html_url"]
            rec["contributions"] += c.get("contributions", 0)
            rec["repos"].append(repo)
            added += 1
        print(f"  {repo}: {added} contributors")

    people = sorted(agg.values(), key=lambda x: x["contributions"], reverse=True)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(people, f, indent=2, ensure_ascii=False)

    print(f"\nUnique contributors: {len(people)}")
    print(f"Wrote → {OUT_PATH.relative_to(OUT_PATH.parent.parent)}")


if __name__ == "__main__":
    main()
