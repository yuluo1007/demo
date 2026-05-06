#!/usr/bin/env python3
"""Build static blog pages from markdown files in blog/posts/.

Usage:  python3 build_blog.py
Output: blog/index.html and blog/<slug>.html for each post.

Each markdown file must start with YAML-style frontmatter:

    ---
    title: My Post Title
    date: 2026-04-28
    excerpt: One-line summary that appears on the blog index.
    author: Optional Author
    ---

    Body in markdown...

Supported markdown: headings, paragraphs, **bold**, *italic*, [links](url),
`inline code`, ```fenced code blocks```, ordered/unordered lists,
> blockquotes, horizontal rules ---, and ![images](url).
"""

import re
import sys
from datetime import date, datetime
from html import escape
from pathlib import Path

ROOT = Path(__file__).parent
POSTS_DIR = ROOT / "blog" / "posts"
OUT_DIR = ROOT / "blog"


# ---------------------------------------------------------------------------
# Mini markdown -> HTML
# ---------------------------------------------------------------------------

def render_inline(s: str) -> str:
    # Stash inline code so its contents aren't touched by other rules.
    stash: list[str] = []

    def code_repl(m: re.Match) -> str:
        stash.append(m.group(1))
        return f"\x00CODE{len(stash) - 1}\x00"

    s = re.sub(r"`([^`]+)`", code_repl, s)
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    def media_repl(m: re.Match) -> str:
        alt, src = m.group(1), m.group(2)
        if re.search(r"\.(mp4|webm|mov|m4v)(\?|$)", src, re.I):
            return (f'<video src="{src}" controls preload="metadata" '
                    f'playsinline aria-label="{alt}"></video>')
        return f'<img src="{src}" alt="{alt}" loading="lazy"/>'

    s = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", media_repl, s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
               r'<a href="\2" rel="noopener">\1</a>', s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*\s][^*]*?)\*(?!\*)", r"<em>\1</em>", s)
    for i, code in enumerate(stash):
        s = s.replace(f"\x00CODE{i}\x00", f"<code>{escape(code)}</code>")
    return s


TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-{3,}:?(\s*\|\s*:?-{3,}:?)+\s*\|?\s*$")


def _split_row(line: str) -> list[str]:
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|"):
        s = s[:-1]
    return [c.strip() for c in s.split("|")]


def _aligns(sep_line: str) -> list[str]:
    out = []
    for c in _split_row(sep_line):
        l, r = c.startswith(":"), c.endswith(":")
        out.append("center" if l and r else "right" if r else "left" if l else "")
    return out


def _render_table(headers: list[str], aligns: list[str], rows: list[list[str]]) -> str:
    def cell(tag: str, text: str, idx: int) -> str:
        a = aligns[idx] if idx < len(aligns) else ""
        style = f' style="text-align:{a}"' if a else ""
        return f"<{tag}{style}>{render_inline(text)}</{tag}>"

    parts = ["<table><thead><tr>"]
    parts += [cell("th", h, i) for i, h in enumerate(headers)]
    parts.append("</tr></thead><tbody>")
    for row in rows:
        parts.append("<tr>")
        parts += [cell("td", c, i) for i, c in enumerate(row)]
        parts.append("</tr>")
    parts.append("</tbody></table>")
    return "".join(parts)


def md_to_html(text: str) -> str:
    lines = text.split("\n")
    out: list[str] = []
    para: list[str] = []
    list_type: str | None = None
    in_code = False
    code_lang = ""
    code_buf: list[str] = []

    def flush_para() -> None:
        if para:
            out.append("<p>" + render_inline(" ".join(para)) + "</p>")
            para.clear()

    def flush_list() -> None:
        nonlocal list_type
        if list_type:
            out.append(f"</{list_type}>")
            list_type = None

    i = 0
    while i < len(lines):
        line = lines[i]
        if in_code:
            if line.strip().startswith("```"):
                lang = f' class="lang-{escape(code_lang)}"' if code_lang else ""
                out.append(f"<pre><code{lang}>"
                           + escape("\n".join(code_buf)) + "</code></pre>")
                code_buf.clear()
                in_code = False
                code_lang = ""
            else:
                code_buf.append(line)
            i += 1
            continue

        stripped = line.strip()
        if stripped.startswith("```"):
            flush_para(); flush_list()
            in_code = True
            code_lang = stripped[3:].strip()
            i += 1
            continue

        m = re.match(r"^(#{1,6})\s+(.+)$", line)
        if m:
            flush_para(); flush_list()
            level = len(m.group(1))
            out.append(f"<h{level}>{render_inline(m.group(2).strip())}</h{level}>")
            i += 1
            continue

        if re.match(r"^[-*_]{3,}\s*$", line):
            flush_para(); flush_list()
            out.append("<hr/>")
            i += 1
            continue

        if stripped.startswith(">"):
            flush_para(); flush_list()
            out.append("<blockquote>"
                       + render_inline(stripped.lstrip("> ").strip())
                       + "</blockquote>")
            i += 1
            continue

        if "|" in line and i + 1 < len(lines) and TABLE_SEP_RE.match(lines[i + 1]):
            flush_para(); flush_list()
            headers = _split_row(line)
            aligns = _aligns(lines[i + 1])
            rows: list[list[str]] = []
            j = i + 2
            while j < len(lines) and "|" in lines[j] and lines[j].strip():
                rows.append(_split_row(lines[j]))
                j += 1
            out.append(_render_table(headers, aligns, rows))
            i = j
            continue

        m = re.match(r"^[-*+]\s+(.+)$", line)
        if m:
            flush_para()
            if list_type != "ul":
                flush_list()
                out.append("<ul>")
                list_type = "ul"
            out.append("<li>" + render_inline(m.group(1)) + "</li>")
            i += 1
            continue

        m = re.match(r"^\d+\.\s+(.+)$", line)
        if m:
            flush_para()
            if list_type != "ol":
                flush_list()
                out.append("<ol>")
                list_type = "ol"
            out.append("<li>" + render_inline(m.group(1)) + "</li>")
            i += 1
            continue

        if not stripped:
            flush_para(); flush_list()
            i += 1
            continue

        flush_list()
        para.append(line.rstrip())
        i += 1

    flush_para()
    flush_list()
    if in_code and code_buf:
        out.append("<pre><code>" + escape("\n".join(code_buf)) + "</code></pre>")
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Frontmatter
# ---------------------------------------------------------------------------

FM_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n(.*)\Z", re.DOTALL)


def parse_post(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = FM_RE.match(text)
    if not m:
        sys.exit(f"error: {path} is missing --- frontmatter ---")
    meta: dict = {}
    for line in m.group(1).split("\n"):
        if not line.strip() or ":" not in line:
            continue
        k, v = line.split(":", 1)
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in ('"', "'"):
            quote = v[0]
            v = v[1:-1].replace("\\" + quote, quote).replace("\\\\", "\\")
        meta[k.strip()] = v
    if "title" not in meta or "date" not in meta:
        sys.exit(f"error: {path} requires both 'title' and 'date' frontmatter")
    try:
        meta["_date"] = datetime.strptime(meta["date"], "%Y-%m-%d").date()
    except ValueError:
        sys.exit(f"error: {path} has invalid date '{meta['date']}' (expected YYYY-MM-DD)")
    meta.setdefault("excerpt", "")
    meta.setdefault("author", "")
    meta.setdefault("hero", "")
    meta.setdefault("category", "")
    return meta, m.group(2)


# ---------------------------------------------------------------------------
# HTML templates
# ---------------------------------------------------------------------------

def fmt_date(d: date) -> str:
    return d.strftime("%B %d, %Y")


PAGE_OPEN = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{title}</title>
<link rel="icon" type="image/png" href="../logo.png"/>
<link rel="stylesheet" href="blog.css"/>
{head_extra}
</head>
<body>
<nav class="nav" id="nav">
  <a class="nav-brand" href="../">
    <img src="../logo.png" alt="AgentScope"/>
    <span>AgentScope</span>
  </a>
  <button class="nav-toggle" type="button" aria-label="Menu" aria-controls="nav-links" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <div class="nav-links" id="nav-links">
    <div class="nav-projects">
      <a class="nav-projects-trigger" href="../#projects" aria-haspopup="true">
        Projects
        <svg class="caret" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2 4l4 4 4-4z"/></svg>
      </a>
      <div class="nav-projects-menu" role="menu">
        <div class="nav-projects-grid">
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope" target="_blank" rel="noopener">
            <span class="name">agentscope</span>
            <span class="desc">Core open-source framework for building agents you can see, understand, and trust.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/QwenPaw" target="_blank" rel="noopener">
            <span class="name">QwenPaw</span>
            <span class="desc">Personal AI assistant — easy to install on your machine or the cloud.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/HiClaw" target="_blank" rel="noopener">
            <span class="name">HiClaw</span>
            <span class="desc">Collaborative multi-agent OS for human-in-the-loop coordination via Matrix.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/ReMe" target="_blank" rel="noopener">
            <span class="name">ReMe</span>
            <span class="desc">Memory management kit for agents — Remember Me, Refine Me.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-java" target="_blank" rel="noopener">
            <span class="name">agentscope-java</span>
            <span class="desc">Agent-oriented programming for the JVM.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-runtime" target="_blank" rel="noopener">
            <span class="name">agentscope-runtime</span>
            <span class="desc">Production runtime with sandboxed tools, Agent-as-a-Service APIs, and observability.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/Trinity-RFT" target="_blank" rel="noopener">
            <span class="name">Trinity-RFT</span>
            <span class="desc">Flexible, scalable framework for reinforcement fine-tuning of LLMs.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/OpenJudge" target="_blank" rel="noopener">
            <span class="name">OpenJudge</span>
            <span class="desc">Unified framework for holistic evaluation and quality rewards.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-studio" target="_blank" rel="noopener">
            <span class="name">agentscope-studio</span>
            <span class="desc">Development-oriented visualization toolkit for agent runs.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-spark-design" target="_blank" rel="noopener">
            <span class="name">agentscope-spark-design</span>
            <span class="desc">UI component library for Alibaba Cloud Apsara Lab.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-samples" target="_blank" rel="noopener">
            <span class="name">agentscope-samples</span>
            <span class="desc">Ready-to-use Python sample agents — from CLI tools to full-stack apps.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-runtime-java" target="_blank" rel="noopener">
            <span class="name">agentscope-runtime-java</span>
            <span class="desc">Runtime framework for agent deployment and tool sandboxing on the JVM.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/skills" target="_blank" rel="noopener">
            <span class="name">skills</span>
            <span class="desc">Curated skills around the AgentScope ecosystem and CoPaw applications.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-bricks" target="_blank" rel="noopener">
            <span class="name">agentscope-bricks</span>
            <span class="desc">Production-ready agent components compatible with AgentScope, LangGraph, AutoGen.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/TuFT" target="_blank" rel="noopener">
            <span class="name">TuFT</span>
            <span class="desc">Multi-tenant fine-tuning for local LLMs with a Tinker-compatible API.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://mingle.top/" target="_blank" rel="noopener">
            <span class="name">PawFriends</span>
            <span class="desc">Social media for AI agents — give your agent a personality and watch it make friends.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/DojoZero" target="_blank" rel="noopener">
            <span class="name">DojoZero</span>
            <span class="desc">Agents that run on realtime data and predict future game outcomes.</span>
          </a>
          <a class="nav-project-item" role="menuitem" href="https://github.com/agentscope-ai/agentscope-typescript" target="_blank" rel="noopener">
            <span class="name">agentscope-typescript</span>
            <span class="desc">TypeScript agent framework — born for agent systems.</span>
          </a>
        </div>
      </div>
    </div>
    <a href="./" class="active">Blogs</a>
    <a href="../community.html">Community</a>
    <div class="nav-socials">
      <a class="nav-icon" href="https://github.com/agentscope-ai" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56C20.71 21.4 24 17.09 24 12.02 24 5.74 18.77.5 12.5.5h-.5Z"/></svg>
      </a>
      <a class="nav-icon" href="https://x.com/agentscope_ai" target="_blank" rel="noopener" aria-label="X (Twitter)">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a class="nav-icon" href="https://discord.com/invite/eYMpfnkG8h" target="_blank" rel="noopener" aria-label="Discord">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
      </a>
      <a class="nav-icon" href="https://www.xiaohongshu.com/user/profile/691c18db0000000037032be9" target="_blank" rel="noopener" aria-label="RedNote (Xiaohongshu)">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972.794.794 0 0 0-.884-.618.795.795 0 0 0-.692.794c0 .101-.002.666.001.777zm-11.509 4.808c-.203.001-1.353.004-1.685.003a2.528 2.528 0 0 1-.766-.126.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124.66.01 1.32.002 1.981 0 .01 0 .02-.006.023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01a.834.834 0 0 0-.01.08c-.027.397-.038.495-.234 3.06-.012.24-.034.389-.135.607-.026.057-.033.042.003.112.046.092.681 1.523.787 1.74.008.015.011.02.017.02.008 0 .033-.026.047-.044.147-.187.268-.391.371-.606.306-.635.44-1.325.486-1.706.014-.11.021-.22.03-.33l.204-2.616.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.427 1.427 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.443.443 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293c.076.982.153 1.964.233 2.946.05.4.186 1.085.487 1.706.103.215.223.419.37.606.015.018.037.051.048.049.02-.003.742-1.642.804-1.765.036-.07.03-.055.003-.112zm3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56c-.01 0-.02.006-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.534.534 0 0 0-.02.191.46.46 0 0 0 .23.378.981.981 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.53.53 0 0 0-.023.172.465.465 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001c.01 0 .02-.006.023-.015l.575-1.28a.025.025 0 0 0-.024-.035zm-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829 0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047.001.037.465 1.064.555 1.263.01.02.03.033.051.033.157.003.767.009.938-.014.153-.02.3-.06.438-.132.3-.156.49-.419.595-.765.052-.172.075-.353.075-.533.002-2.33 0-4.66-.007-6.991a.032.032 0 0 0-.032-.032zm11.784 6.896c0-.014-.01-.021-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084-.37 0-1.11-.002-1.304 0-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036c.006.01.013.008.058.008 1.748.003 3.495.002 5.243.002.03-.001.034-.006.035-.033v-1.539zm4.177-3.43c0 .013-.007.023-.02.024-.346.006-.692.004-1.037.004-.014-.002-.022-.01-.022-.024-.005-.434-.007-.869-.01-1.303 0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015.093.025.16.107.165.204.006.431.002 1.153.001 1.153zm2.67.244a1.953 1.953 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21c0-.132-.007-.263-.025-.394a1.823 1.823 0 0 0-.153-.53 1.533 1.533 0 0 0-.677-.71 2.167 2.167 0 0 0-1-.258c-.153-.003-.567 0-.72 0-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007c-.006.006-.008.012-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128V11.19s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003c.098 0 .191.02.28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185 0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033.184.437.374.871.57 1.303a.045.045 0 0 0 .04.026c.17.005.34.002.51.003.15-.002.517.004.666-.01a2.03 2.03 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981c0-.128-.01-.254-.034-.38 0 .078-.029-.641-.724-.998z"/></svg>
      </a>
      <a class="nav-icon" href="https://www.dingtalk.com/download?action=joingroup&code=v1,k1,1k7GcVwa5PzZWRaWyBA5OFImW0zNNx1Gj9RkjnuKVGY=" target="_blank" rel="noopener" aria-label="DingTalk">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.49 9.04l-.006.014c-.42.898-1.516 2.66-1.516 2.66l-.005-.012-.32.558h1.543l-2.948 3.919.67-2.666h-1.215l.422-1.763c-.41.087-.815.205-1.223.349 0 0-.646.378-1.862-.729 0 0-.82-.722-.344-.902.202-.077.981-.175 1.595-.257.652-.087 1.338-.172 1.338-.172s-2.555.039-3.161-.057c-.606-.095-1.375-1.107-1.539-1.996 0 0-.253-.488.545-.257s4.101.9 4.101.9S8.27 9.312 7.983 8.99c-.286-.32-.841-1.754-.769-2.634 0 0 .031-.22.257-.16 0 0 3.176 1.45 5.347 2.245s4.06 1.199 3.816 2.228c-.02.087-.072.216-.144.37"/></svg>
      </a>
    </div>
  </div>
</nav>
"""

PAGE_CLOSE = """<footer class="blog-footer">
  <p>
    <a href="../">agentscope.io</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/agentscope-ai" target="_blank" rel="noopener">GitHub</a>
    &nbsp;·&nbsp;
    <a href="https://docs.agentscope.io" target="_blank" rel="noopener">Docs</a>
    &nbsp;·&nbsp;
    <a href="./">Blogs</a>
    &nbsp;·&nbsp;
    <a href="../community.html">Community</a>
    &nbsp;·&nbsp;
    Built with care by the AgentScope team
  </p>
</footer>

<script>
(function(){
  const nav = document.getElementById('nav');
  if (!nav) return;
  const toggle = nav.querySelector('.nav-toggle');
  if (!toggle) return;
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('.nav-links a, .nav-links .nav-icon').forEach(el => {
    el.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
})();
</script>
</body>
</html>
"""


def render_post_page(meta: dict, body_html: str) -> str:
    title = escape(meta["title"])
    date_str = fmt_date(meta["_date"])
    author = escape(meta.get("author", ""))
    category = escape(meta.get("category", ""))
    byline = f'<span class="byline">by {author}</span>' if author else ""
    eyebrow = f'<span class="post-eyebrow">{category}</span>' if category else ""
    hero = meta.get("hero", "")
    hero_html = (
        f'    <figure class="post-hero"><img src="../{escape(hero)}" alt="{title}" loading="eager"/></figure>\n'
        if hero else ""
    )
    return (
        PAGE_OPEN.format(title=f"{title} — AgentScope Blog", head_extra="")
        + f'<main class="post">\n'
          f'  <a class="back-link" href="./">← All posts</a>\n'
          f'  <article>\n'
          f'    <header class="post-header">\n'
          f'      {eyebrow}\n'
          f'      <h1>{title}</h1>\n'
          f'      <div class="post-meta"><time datetime="{meta["_date"]}">{date_str}</time>{byline}</div>\n'
          f'    </header>\n'
          f'{hero_html}'
          f'    <div class="post-body">\n{body_html}\n    </div>\n'
          f'  </article>\n'
          f'</main>\n'
        + PAGE_CLOSE
    )


def render_index_page(posts: list[dict]) -> str:
    cards: list[str] = []
    for p in posts:
        title = escape(p["title"])
        excerpt = escape(p.get("excerpt", ""))
        date_str = fmt_date(p["_date"])
        category = escape(p.get("category", ""))
        hero = p.get("hero", "")
        media = (
            f'  <div class="post-card-media"><img src="../{escape(hero)}" alt="{title}" loading="lazy"/></div>\n'
            if hero else ""
        )
        tag = f'<span class="post-card-tag">{category}</span>' if category else ""
        cards.append(
            f'<a class="post-card{" has-media" if hero else ""}" href="{p["slug"]}.html">\n'
            f'{media}'
            f'  <div class="post-card-body">\n'
            f'    <div class="post-card-meta">\n'
            f'      <time datetime="{p["_date"]}">{date_str}</time>\n'
            f'      {tag}\n'
            f'    </div>\n'
            f'    <h2>{title}</h2>\n'
            f'    <p>{excerpt}</p>\n'
            f'    <span class="read-more">Read post <span class="arrow">→</span></span>\n'
            f'  </div>\n'
            f'</a>'
        )
    body = (
        '<main class="blog-index">\n'
        '  <header class="blog-index-header">\n'
        '    <span class="eyebrow">Blog &amp; Stories</span>\n'
        '    <h1>Notes from the AgentScope team</h1>\n'
        '    <p class="lede">Updates, deep dives, and user stories from across the AgentScope ecosystem.</p>\n'
        '  </header>\n'
        '  <div class="post-list">\n' + "\n".join(cards) + '\n  </div>\n'
        '</main>\n'
    )
    return PAGE_OPEN.format(title="Blog — AgentScope", head_extra="") + body + PAGE_CLOSE


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build() -> None:
    if not POSTS_DIR.exists():
        sys.exit(f"error: {POSTS_DIR} does not exist")

    posts: list[dict] = []
    expected: set[str] = {"index.html"}
    for path in sorted(POSTS_DIR.glob("*.md")):
        meta, body = parse_post(path)
        meta["slug"] = path.stem
        body_html = md_to_html(body)
        out_path = OUT_DIR / f"{path.stem}.html"
        out_path.write_text(render_post_page(meta, body_html), encoding="utf-8")
        expected.add(out_path.name)
        posts.append(meta)
        print(f"  wrote {out_path.relative_to(ROOT)}")

    posts.sort(key=lambda p: p["_date"], reverse=True)
    index_path = OUT_DIR / "index.html"
    index_path.write_text(render_index_page(posts), encoding="utf-8")
    print(f"  wrote {index_path.relative_to(ROOT)}")

    for stale in OUT_DIR.glob("*.html"):
        if stale.name not in expected:
            stale.unlink()
            print(f"  removed stale {stale.relative_to(ROOT)}")

    print(f"built {len(posts)} post(s)")


if __name__ == "__main__":
    build()
