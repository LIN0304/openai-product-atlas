#!/usr/bin/env python3
"""Build the platform/lifecycle research lane from cached official OpenAI pages.

The source pages are living changelogs. The generated JSON deliberately records
the retrieval date and extraction status so downstream synthesis can distinguish
page-complete extraction from selected launch-post coverage.
"""

from __future__ import annotations

import html
import json
import re
from collections import Counter
from datetime import date, datetime
from pathlib import Path


ROOT = Path("research/openai-timeline-v0.1/lane-results")
CACHE = Path("/tmp/openai-timeline")
RETRIEVED_AT = "2026-07-13"
SCOPE_START = date(2022, 11, 30)

API_CHANGELOG = "https://developers.openai.com/api/docs/changelog"
API_DEPRECATIONS = "https://developers.openai.com/api/docs/deprecations"
CODEX_CHANGELOG = "https://developers.openai.com/codex/changelog/"
APPS_CHANGELOG = "https://developers.openai.com/apps-sdk/changelog/"
MAC_NOTES = "https://help.openai.com/en/articles/9703738-desktop-app-release-notes"
WINDOWS_NOTES = "https://help.openai.com/en/articles/10003026-windows-app-release-notes"
ATLAS_NOTES = "https://help.openai.com/en/articles/12591856-chatgpt-atlas-release-notes"
ENTERPRISE_NOTES = "https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes"
BUSINESS_NOTES = "https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes"


def clip(text: str, limit: int = 900) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0] + "…"


def clean_html(fragment: str) -> str:
    fragment = re.sub(
        r"<(script|style|svg|button)\b.*?</\1>", " ", fragment, flags=re.S | re.I
    )
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = re.sub(
        r"\bli\+li\]:mt-1 text-default \[&_p\]:m-0\">?\s*", " ", fragment
    )
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def iso(y: int, mon: str, day: int) -> str:
    months = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12,
    }
    return f"{y:04d}-{months[mon]:02d}-{day:02d}"


def topic_info(text: str) -> tuple[str, str, list[str]]:
    low = text.lower()
    if "deprecat" in low or "retir" in low or "sunset" in low or "shut down" in low:
        return "Safety & Lifecycle", "Lifecycle", ["deprecation", "migration"]
    if "moderation" in low or "safety" in low or "security" in low or "lockdown" in low:
        return "Safety & Lifecycle", "Safety & Security", ["safety", "security"]
    if "codex" in low:
        return "Agents & Research", "Codex", ["codex", "coding-agent"]
    if re.search(r"\b(?:released|launched|introduc(?:ed|ing))\b.{0,45}\bgpt[-‑ ]?\d", low):
        return "Models & Reasoning", "Model Platform", ["models", "api"]
    if "responses api" in low or "/v1/responses" in low:
        return "Agents & Research", "Responses API", ["responses-api", "agents"]
    if "agents sdk" in low:
        return "Agents & Research", "Agents SDK", ["agents-sdk", "agents"]
    if "agent builder" in low or "chatkit" in low:
        return "Agents & Research", "AgentKit", ["agentkit", "agents"]
    if "realtime" in low or "speech" in low or "audio" in low or "whisper" in low:
        return "Multimodal", "Realtime & Audio API", ["realtime", "audio"]
    if "sora" in low or "video" in low:
        return "Multimodal", "Videos API", ["video", "sora"]
    if "image" in low or "dall·e" in low or "dall-e" in low:
        return "Multimodal", "Image API", ["image-generation", "multimodal"]
    if "fine-tun" in low or "fine tun" in low:
        return "Developer Platform", "Fine-tuning API", ["fine-tuning", "custom-models"]
    if "embedding" in low:
        return "Developer Platform", "Embeddings API", ["embeddings", "retrieval"]
    if "batch api" in low or "/v1/batch" in low:
        return "Developer Platform", "Batch API", ["batch", "cost-optimization"]
    if "mcp" in low or "connector" in low:
        return "Developer Platform", "MCP & Connectors", ["mcp", "connectors"]
    if "admin api" in low or "rbac" in low or "allowlist" in low or "data residency" in low:
        return "Enterprise & Vertical", "API Platform Admin", ["enterprise", "admin"]
    if re.search(r"\bgpt[-‑ ]?\d|\bo[134]-|model", low):
        return "Models & Reasoning", "Model Platform", ["models", "api"]
    return "Developer Platform", "OpenAI API Platform", ["api-platform"]


def zh_topic(text: str) -> str:
    low = text.lower()
    labels = []
    checks = [
        (("deprecat", "retir", "sunset", "shut down"), "棄用與遷移"),
        (("security", "safety", "moderation", "lockdown"), "安全與治理"),
        (("codex",), "Codex 編碼代理"),
        (("responses", "agent", "tool"), "代理與工具調用"),
        (("realtime", "audio", "voice", "speech", "whisper"), "即時語音與音訊"),
        (("image", "dall", "sora", "video"), "圖像與影片"),
        (("fine-tun",), "模型微調"),
        (("embedding", "retrieval"), "向量嵌入與檢索"),
        (("admin", "rbac", "allowlist", "residency"), "企業管理控制"),
        (("price", "billing", "cost", "credit"), "定價與用量"),
        (("fix", "bug", "reliability", "performance"), "可靠性與效能修正"),
    ]
    for needles, label in checks:
        if any(n in low for n in needles) and label not in labels:
            labels.append(label)
    return "、".join(labels[:3]) or "平台功能與可用性"


API_ZH_TITLE_OVERRIDES = [
    ("GPT-5.6 model family", "推出 GPT‑5.6 Sol、Terra 與 Luna 模型家族"),
    ("GPT-Realtime-2.1", "推出 GPT‑Realtime‑2.1 與 GPT‑Realtime‑2.1 mini"),
    ("Safety Usage Dashboard", "推出 OpenAI API 安全用量儀表板"),
    ("moderation scores", "Responses 與 Chat Completions 新增內容審核分數"),
    ("reusable prompt objects", "宣布棄用可重用提示、Evals 平台與 Agent Builder"),
    ("Amazon Bedrock", "OpenAI 模型透過相容 Responses API 登上 Amazon Bedrock"),
    ("workload identity federation", "推出工作負載身分聯邦"),
    ("Secure MCP Tunnel", "推出企業版 Secure MCP Tunnel"),
    ("Released GPT-5.5", "API 推出 GPT‑5.5 與 GPT‑5.5 Pro"),
    ("Released GPT Image 2", "API 推出 GPT Image 2"),
    ("Released GPT-5.4 mini", "API 推出 GPT‑5.4 mini 與 GPT‑5.4 nano"),
    ("Expanded the Sora API", "擴充 Sora API：角色參考、長影片、1080p、延伸與 Batch"),
    ("Released GPT-5.4", "API 推出 GPT‑5.4、GPT‑5.4 Pro 與代理工具能力"),
    ("Launched WebSocket mode", "Responses API 推出 WebSocket 模式"),
    ("Released GPT-Realtime-1.5", "推出 GPT‑Realtime‑1.5 與 gpt‑audio‑1.5"),
    ("Launched server-side compaction", "Responses API 推出伺服器端上下文壓縮"),
    ("Launched support for Skills", "Responses API 推出 Skills 支援"),
    ("Hosted Shell tool", "Responses API 推出 Hosted Shell 與容器網路"),
    ("Open Responses", "宣布 Open Responses 開源規格"),
    ("Released GPT-5.2", "API 推出 GPT‑5.2"),
    ("Released GPT-5.1", "API 推出 GPT‑5.1 模型家族"),
    ("Released Enterprise Key Management", "推出 Enterprise Key Management"),
    ("OpenAI DevDay", "OpenAI DevDay API 與代理平台更新"),
    ("Realtime API is now generally available", "Realtime API 正式 GA"),
    ("Released the Conversations API", "推出 Conversations API"),
    ("Released GPT-5 family", "API 推出 GPT‑5、GPT‑5 mini 與 GPT‑5 nano"),
    ("deep research variants", "API 推出 o3 與 o4‑mini deep research 模型"),
    ("Released o3-pro", "API 推出 o3‑pro"),
    ("reinforcement fine-tuning", "推出強化微調支援"),
    ("new image generation model", "API 推出 GPT Image 1"),
    ("o-series reasoning models", "API 推出 o3 與 o4‑mini 推理模型"),
    ("gpt-4.1", "API 推出 GPT‑4.1、mini 與 nano"),
    ("Responses API, a new API", "推出 Responses API、內建工具與 Agents SDK"),
    ("research preview of GPT-4.5", "API 推出 GPT‑4.5 研究預覽"),
    ("Launched o3-mini", "API 推出 o3‑mini"),
    ("OpenAI DevDay in San Francisco", "DevDay 推出 Realtime API、蒸餾、視覺微調、Evals 與提示快取"),
    ("omni-moderation-latest", "推出 omni‑moderation‑latest 多模態審核模型"),
    ("o1-preview and o1-mini", "API 推出 o1‑preview 與 o1‑mini 推理模型"),
    ("Structured Outputs", "API 推出 Structured Outputs"),
    ("Released GPT-4o in the API", "API 推出 GPT‑4o"),
    ("Released Batch API", "推出 Batch API"),
    ("GPT-4 Turbo with Vision", "GPT‑4 Turbo with Vision 在 API 正式 GA"),
    ("embedding V3 models", "推出第三代 Embeddings 模型與更新版 GPT‑4 Turbo 預覽"),
    ("GPT-4 Turbo Preview", "DevDay 推出 GPT‑4 Turbo、Assistants API、DALL·E 3、TTS 與 Python SDK v1"),
]


def api_title_zh(title: str, summary: str) -> str:
    joined = title + " " + summary
    for needle, translated in API_ZH_TITLE_OVERRIDES:
        if needle.lower() in joined.lower():
            return translated
    action = "API 更新"
    remainder = title
    actions = (
        (r"^Released\s+", "推出"),
        (r"^Launched\s+", "推出"),
        (r"^Added\s+", "新增"),
        (r"^Updated\s+", "更新"),
        (r"^Expanded\s+", "擴充"),
        (r"^Announced\s+", "宣布"),
        (r"^Fixed\s+", "修正"),
        (r"^Starting\s+", "自"),
        (r"^OpenAI models are now available\s+", "OpenAI 模型現已可用"),
    )
    for pattern, translated_action in actions:
        candidate, count = re.subn(pattern, "", remainder, count=1, flags=re.I)
        if count:
            action, remainder = translated_action, candidate
            break
    replacements = (
        ("the ", ""),
        ("support for ", "支援 "),
        ("model family", "模型家族"),
        ("model snapshots", "模型快照"),
        ("model snapshot", "模型快照"),
        ("models", "模型"),
        ("model", "模型"),
        ("to the Responses API", "至 Responses API"),
        ("to the API", "至 API"),
        ("in the API", "於 API"),
        ("is now generally available", "現已正式 GA"),
        ("are now generally available", "現已正式 GA"),
        ("new ", "全新 "),
    )
    for old, new in replacements:
        remainder = re.sub(re.escape(old), new, remainder, flags=re.I)
    return clip(f"{action}：{remainder}", 180)


def event_type_and_lifecycle(kind: str, text: str) -> tuple[str, str]:
    low = text.lower()
    if "deprecated and removed" in low or "no longer available" in low or "retired" in low:
        return "retirement", "retired"
    if "deprecat" in low or "sunset" in low:
        return "deprecation", "deprecation_announced"
    if "general availability" in low or "generally available" in low or " is now ga" in low:
        return "availability", "general_availability"
    if re.search(r"\breleased\b|\blaunched\b|\bintroduc", low):
        release_lifecycle = "preview" if "research preview" in low else "launch"
        if re.search(r"\bgpt[-‑ ]?\d|\bo[134]-|model", low):
            return "model_release", release_lifecycle
        return "launch", release_lifecycle
    if "beta" in low or "preview" in low:
        return "feature", "preview"
    if kind.lower() == "fix" or re.search(r"\bfixed\b|bug fixes", low):
        return "fix", "update"
    if kind.lower() == "announcement":
        return "announcement", "announced"
    return "update", "update"


def importance(text: str, event_type: str) -> int:
    low = text.lower()
    if any(
        x in low
        for x in (
            "gpt-5.6",
            "gpt-5.5",
            "gpt-5 family",
            "responses api, a new api",
            "assistants api",
            "codex is now generally available",
            "introducing the codex app",
            "chatgpt enterprise",
            "chatgpt team",
            "chatgpt edu",
            "chatgpt atlas",
        )
    ):
        return 5
    if event_type in {"retirement", "deprecation"}:
        return 4
    if any(
        x in low
        for x in (
            "released gpt",
            "launched gpt",
            "realtime api is now generally available",
            "agents sdk",
            "batch api",
            "structured outputs",
            "function calling",
            "agent builder",
            "apps sdk",
            "lockdown mode",
            "advanced account security",
        )
    ):
        return 4
    if event_type == "fix":
        return 1
    if any(x in low for x in ("pricing", "billing", "admin", "rbac", "fine-tun", "mcp")):
        return 3
    return 2 if event_type == "update" else 3


def make_event(
    *,
    event_id: str,
    date_value: str,
    title_en: str,
    title_zh: str,
    summary_en: str,
    summary_zh: str,
    product_family: str,
    product: str,
    event_type: str,
    importance_value: int,
    lifecycle: str,
    source_name: str,
    source_url: str,
    source_kind: str,
    coverage_status: str = "complete",
    confidence: str = "high",
    tags: list[str] | None = None,
) -> dict:
    return {
        "event_id": event_id,
        "date": date_value,
        "title_en": clip(title_en, 180),
        "title_zh": clip(title_zh, 180),
        "summary_en": clip(summary_en, 1200),
        "summary_zh": clip(summary_zh, 500),
        "product_family": product_family,
        "product": product,
        "event_type": event_type,
        "importance": int(importance_value),
        "lifecycle": lifecycle,
        "source_name": source_name,
        "source_url": source_url,
        "source_kind": source_kind,
        "coverage_status": coverage_status,
        "confidence": confidence,
        "tags": sorted(set(tags or [])),
    }


def structured_lines(raw: str) -> list[str]:
    raw = re.sub(r"<(script|style|svg)\b.*?</\1>", "", raw, flags=re.S | re.I)
    for tag in ("h1", "h2", "h3", "h4", "p", "li", "tr"):
        raw = re.sub(fr"<{tag}\b[^>]*>", f"\n[{tag.upper()}] ", raw, flags=re.I)
        raw = re.sub(fr"</{tag}>", "\n", raw, flags=re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    raw = html.unescape(raw)
    return [re.sub(r"[ \t]+", " ", line).strip() for line in raw.splitlines() if line.strip()]


def extract_api_changelog() -> list[dict]:
    raw = (CACHE / "api-changelog.html").read_text(errors="ignore")
    lines = structured_lines(raw)
    start = next(i for i, x in enumerate(lines) if x == "[H1] Changelog")
    year = None
    entries = []
    current = None
    date_re = re.compile(
        r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})\s+(Feature|Update|Fix|Announcement)\s*(.*)$"
    )
    for line in lines[start + 1 :]:
        month_heading = re.match(r"\[H3\] [A-Za-z]+, (202\d)", line)
        if month_heading:
            if current:
                entries.append(current)
                current = None
            year = int(month_heading.group(1))
            continue
        hit = date_re.match(line)
        if hit and year:
            if current:
                entries.append(current)
            current = {
                "date": iso(year, hit.group(1), int(hit.group(2))),
                "kind": hit.group(3),
                "meta": hit.group(4),
                "lines": [],
            }
            continue
        if current and (line.startswith("[P] ") or line.startswith("[LI] ")):
            current["lines"].append(re.sub(r"^\[(?:P|LI)\]\s*", "", line))
        if line.startswith("[H2]") and current:
            break
    if current:
        entries.append(current)

    output = []
    per_date = Counter()
    for row in entries:
        summary = clip(" ".join(row["lines"]), 1100)
        if not summary:
            continue
        per_date[row["date"]] += 1
        title = re.split(r"(?<=[.!?])\s", summary, maxsplit=1)[0]
        family, product, tags = topic_info(row["meta"] + " " + summary)
        event_type, lifecycle = event_type_and_lifecycle(row["kind"], summary)
        title_zh = api_title_zh(title, summary)
        kind_zh = {"Feature": "功能", "Update": "更新", "Fix": "修正", "Announcement": "公告"}.get(row["kind"], row["kind"])
        summary_zh = (
            f"{title_zh.rstrip(' .。')}。OpenAI 將此列為 {row['date']} 的{kind_zh}；"
            f"重點涉及{zh_topic(summary)}，模型、端點與參數名稱依官方英文保留。"
        )
        output.append(
            make_event(
                event_id=f"platform-api-{row['date'].replace('-', '')}-{per_date[row['date']]:02d}",
                date_value=row["date"],
                title_en=title,
                title_zh=title_zh,
                summary_en=summary,
                summary_zh=summary_zh,
                product_family=family,
                product=product,
                event_type=event_type,
                importance_value=importance(summary, event_type),
                lifecycle=lifecycle,
                source_name="OpenAI API Changelog",
                source_url=API_CHANGELOG,
                source_kind="official_changelog",
                tags=tags + [row["kind"].lower()],
            )
        )
    return output


def extract_release_changelog(filename: str, prefix: str, source_name: str, source_url: str) -> list[dict]:
    raw = (CACHE / filename).read_text(errors="ignore")
    if prefix == "apps-sdk-":
        starts = list(
            re.finditer(r'<li id="([^"]+)"[^>]*data-products="[^"]*apps-sdk[^"]*"', raw)
        )
    else:
        starts = list(re.finditer(rf'<li id="({re.escape(prefix)}[^" ]+)"', raw))
    output = []
    for index, match in enumerate(starts):
        block = raw[match.start() : starts[index + 1].start() if index + 1 < len(starts) else len(raw)]
        d_match = re.search(r"<time[^>]*>(.*?)</time>", block, re.S)
        h_match = re.search(r"<h3[^>]*>(.*?)</h3>", block, re.S)
        article_match = re.search(r"<article[^>]*>(.*?)</article>", block, re.S)
        if not d_match or not h_match:
            continue
        date_value = clean_html(d_match.group(1))
        if not re.fullmatch(r"202\d-\d\d-\d\d", date_value):
            continue
        title = clean_html(h_match.group(1))
        summary = clean_html(article_match.group(1)) if article_match else title
        summary = clip(summary or title, 1100)
        if prefix == "codex-":
            family = "Clients & Surfaces" if "ios" in title.lower() else "Agents & Research"
            product = "Codex Mobile" if "ios" in title.lower() else "Codex"
            tags = ["codex", "release-notes"] + (["mobile"] if "ios" in title.lower() else [])
        else:
            family, product, tags = "Developer Platform", "Apps SDK", ["apps-sdk", "mcp", "chatgpt-apps"]
        title_low = title.lower()
        if "deprecated" in title_low:
            event_type, lifecycle = "deprecation", "deprecation_announced"
        elif "general availability" in title_low or "generally available" in title_low:
            event_type, lifecycle = "availability", "general_availability"
        elif title_low.startswith("introducing ") or any(
            phrase in title_low
            for phrase in (" joins the ", "build and deploy ", "is now available")
        ):
            event_type, lifecycle = "launch", "launch"
        elif re.match(r"^(codex app|chatgpt for ios)\b", title_low):
            event_type, lifecycle = "update", "update"
        else:
            event_type, lifecycle = event_type_and_lifecycle("Update", title + " " + summary)
        zh_title = title
        replacements = (
            ("Introducing ", "推出 "),
            ("Build and install ", "建置並安裝 "),
            ("Build and deploy ", "建置並部署 "),
            ("reaches general availability", "正式全面推出"),
            ("joins the ChatGPT desktop app", "加入 ChatGPT 桌面 App"),
            ("is now enabled by default", "現已預設啟用"),
            ("deprecated", "已棄用"),
        )
        for old, new in replacements:
            zh_title = zh_title.replace(old, new)
        if zh_title == title:
            zh_title = f"{title} 更新"
        summary_zh = f"{source_name} 在 {date_value} 記錄了{zh_topic(title + ' ' + summary)}相關更新；完整版本與修正內容見官方英文摘要。"
        output.append(
            make_event(
                event_id=f"platform-{match.group(1)}",
                date_value=date_value,
                title_en=title,
                title_zh=zh_title,
                summary_en=summary,
                summary_zh=summary_zh,
                product_family=family,
                product=product,
                event_type=event_type,
                importance_value=importance(title + " " + summary, event_type),
                lifecycle=lifecycle,
                source_name=source_name,
                source_url=source_url + "#" + match.group(1),
                source_kind="official_changelog",
                tags=tags,
            )
        )
    return output


def extract_deprecations() -> list[dict]:
    raw = (CACHE / "api-deprecations.html").read_text(errors="ignore")
    headings = list(re.finditer(r'<h3 id="([^"]+)"[^>]*>(.*?)</h3>', raw, re.S))
    output = []
    for index, hit in enumerate(headings):
        heading = clean_html(hit.group(2))
        block = raw[hit.end() : headings[index + 1].start() if index + 1 < len(headings) else len(raw)]
        block = re.split(r"<h2\b", block, maxsplit=1, flags=re.I)[0]
        d_match = re.match(r"(20\d{2}-\d{2}-\d{2}):\s*(.*)", heading)
        if d_match:
            date_value, title = d_match.group(1), d_match.group(2)
        elif heading == "Update to OpenAI’s self-serve fine-tuning":
            date_value, title = "2026-05-07", heading
        else:
            continue
        if datetime.strptime(date_value, "%Y-%m-%d").date() < SCOPE_START:
            continue
        paras = [clean_html(x) for x in re.findall(r"<p[^>]*>(.*?)</p>", block, re.S)]
        rows = [clean_html(x) for x in re.findall(r"<tr[^>]*>(.*?)</tr>", block, re.S)]
        paras = [x for x in paras if x]
        rows = [x for x in rows if x and not x.startswith("Shutdown date") and not x.startswith("DateUpdate")]
        summary = " ".join(paras[:3])
        if rows:
            summary += " Schedule/replacements: " + "; ".join(rows[:18])
        summary = clip(summary or title, 1200)
        low = title.lower() + " " + summary.lower()
        if "fine-tun" in low:
            product = "Fine-tuning API"
        elif "assistant" in low:
            product = "Assistants API"
        elif "realtime" in low:
            product = "Realtime API"
        elif "sora" in low or "video" in low:
            product = "Videos API"
        elif "image" in low or "dall" in low:
            product = "Image API"
        elif "agent builder" in low or "evals platform" in low or "reusable prompts" in low:
            product = "Agent Platform"
        else:
            product = "Model Platform"
        output.append(
            make_event(
                event_id=f"platform-deprecation-{date_value.replace('-', '')}-{hit.group(1)}",
                date_value=date_value,
                title_en=title + " deprecation",
                title_zh=f"{title} 棄用公告",
                summary_en=summary,
                summary_zh=f"OpenAI 於 {date_value} 公告 {title} 的棄用或下線時程，並列出替代方案與遷移方向。",
                product_family="Safety & Lifecycle",
                product=product,
                event_type="deprecation",
                importance_value=5 if "assistants api" in low else 4,
                lifecycle="deprecation_announced",
                source_name="OpenAI API Deprecations",
                source_url=API_DEPRECATIONS + "#" + hit.group(1),
                source_kind="official_deprecation_registry",
                tags=["deprecation", "api", product.lower().replace(" ", "-")],
            )
        )
    return output


MANUAL = [
    # Early API milestones not covered by the current API changelog page.
    ("2023-03-01", "GPT-3.5 Turbo and Whisper APIs", "GPT‑3.5 Turbo and Whisper became available through the OpenAI API, adding chat-oriented language generation and hosted speech-to-text.", "GPT‑3.5 Turbo 與 Whisper API", "GPT‑3.5 Turbo 與 Whisper 正式進入 OpenAI API，帶來聊天式生成與託管語音轉文字。", "Developer Platform", "OpenAI API Platform", "launch", 5, "launch", "Introducing APIs for GPT-3.5 Turbo and Whisper", "https://openai.com/index/introducing-chatgpt-and-whisper-apis/", "official_launch_post", ["gpt-3.5", "whisper", "api"]),
    ("2023-03-14", "GPT-4 launches in ChatGPT Plus and the API", "OpenAI released GPT-4 with access in ChatGPT Plus and through an API waitlist for developers.", "GPT‑4 在 ChatGPT Plus 與 API 發布", "OpenAI 發布 GPT‑4，並透過 ChatGPT Plus 與開發者 API 候補名單提供存取。", "Models & Reasoning", "GPT-4", "model_release", 5, "launch", "GPT-4", "https://openai.com/index/gpt-4/", "official_launch_post", ["gpt-4", "api"]),
    ("2023-06-13", "Function calling and other API updates", "OpenAI added function calling to Chat Completions, released updated GPT-4 and GPT-3.5 Turbo snapshots, a 16K GPT-3.5 Turbo variant, lower prices, and deprecation schedules.", "API 函式調用與模型更新", "Chat Completions 新增函式調用，並同步推出模型快照、16K 上下文、降價與棄用時程。", "Developer Platform", "Chat Completions API", "feature", 5, "launch", "Function calling and other API updates", "https://openai.com/index/function-calling-and-other-api-updates/", "official_launch_post", ["function-calling", "chat-completions"]),
    ("2023-07-06", "GPT-4 API reaches general availability", "All paying API customers gained GPT-4 access; GPT-3.5 Turbo, DALL·E and Whisper APIs were declared generally available, while older Completions, embeddings and Edits systems received retirement plans.", "GPT‑4 API 正式 GA", "所有付費 API 客戶取得 GPT‑4 存取；GPT‑3.5 Turbo、DALL·E 與 Whisper API 進入 GA，舊系統同步公布退役計畫。", "Developer Platform", "OpenAI API Platform", "availability", 5, "general_availability", "GPT-4 API general availability", "https://openai.com/index/gpt-4-api-general-availability/", "official_launch_post", ["gpt-4", "ga", "deprecation"]),
    ("2023-08-22", "GPT-3.5 Turbo fine-tuning", "OpenAI launched self-serve fine-tuning for GPT-3.5 Turbo, letting developers customize the model with their own data for narrow use cases.", "GPT‑3.5 Turbo 自助微調", "OpenAI 推出 GPT‑3.5 Turbo 自助微調，讓開發者可用自有資料針對特定任務客製模型。", "Developer Platform", "Fine-tuning API", "feature", 4, "launch", "GPT-3.5 Turbo fine-tuning and API updates", "https://openai.com/index/gpt-3-5-turbo-fine-tuning-and-api-updates/", "official_launch_post", ["fine-tuning", "gpt-3.5"]),

    # Business and education product landmarks.
    ("2023-08-28", "Introducing ChatGPT Enterprise", "OpenAI launched ChatGPT Enterprise with enterprise security and privacy, higher-speed GPT-4, longer context, advanced data analysis, customization, and admin capabilities.", "推出 ChatGPT Enterprise", "OpenAI 推出具企業級安全與隱私、高速 GPT‑4、長上下文、進階資料分析及管理功能的 ChatGPT Enterprise。", "Enterprise & Vertical", "ChatGPT Enterprise", "launch", 5, "launch", "Introducing ChatGPT Enterprise", "https://openai.com/index/introducing-chatgpt-enterprise/", "official_launch_post", ["enterprise", "admin"]),
    ("2024-01-10", "Introducing ChatGPT Team", "OpenAI launched the self-serve ChatGPT Team plan with a collaborative workspace, admin tools, higher model limits, and no training on business data by default.", "推出 ChatGPT Team", "OpenAI 推出自助式 ChatGPT Team，提供協作工作區、管理工具、更高模型額度，且預設不以商業資料訓練。", "Enterprise & Vertical", "ChatGPT Team", "launch", 5, "launch", "Introducing ChatGPT Team", "https://openai.com/index/introducing-chatgpt-team/", "official_launch_post", ["team", "business", "admin"]),
    ("2024-05-30", "Introducing ChatGPT Edu", "OpenAI launched ChatGPT Edu for universities with GPT-4o, advanced tools, custom GPT sharing, enterprise security, SSO, SCIM, and administrative controls.", "推出 ChatGPT Edu", "OpenAI 為大學推出 ChatGPT Edu，包含 GPT‑4o、進階工具、自訂 GPT 分享、企業安全、SSO、SCIM 與管理控制。", "Enterprise & Vertical", "ChatGPT Edu", "launch", 5, "launch", "Introducing ChatGPT Edu", "https://openai.com/index/introducing-chatgpt-edu/", "official_launch_post", ["education", "enterprise", "admin"]),
    ("2025-08-29", "ChatGPT Team renamed ChatGPT Business", "The ChatGPT Team plan was renamed ChatGPT Business; OpenAI said the rename itself did not change features, pricing, limits, or security.", "ChatGPT Team 更名為 ChatGPT Business", "ChatGPT Team 正式更名為 ChatGPT Business；更名本身不改變功能、價格、額度或安全設定。", "Enterprise & Vertical", "ChatGPT Business", "rebrand", 4, "renamed", "ChatGPT Business Rename FAQ", "https://help.openai.com/en/articles/12111915-chatgpt-team-is-now-chatgpt-business", "official_help_center", ["business", "rename"]),

    # macOS and Windows client release-note landmarks.
    ("2024-05-13", "ChatGPT desktop app for macOS", "OpenAI introduced a native ChatGPT macOS app with a keyboard shortcut for quick access and screen-aware assistance, initially rolling out to Plus users.", "ChatGPT macOS 桌面 App", "OpenAI 推出原生 ChatGPT macOS App，提供快速鍵與螢幕情境協助，初期向 Plus 用戶逐步推出。", "Clients & Surfaces", "ChatGPT macOS", "launch", 5, "launch", "Hello GPT-4o", "https://openai.com/index/hello-gpt-4o/", "official_launch_post", ["macos", "desktop"]),
    ("2024-08-06", "Companion window and improved data analysis on macOS", "The macOS app added an always-on-top companion window, richer table and chart interactions, screenshot shortcuts, display selection, local-storage security improvements, and performance fixes.", "macOS 伴隨視窗與資料分析更新", "macOS App 新增置頂伴隨視窗、表格與圖表互動、截圖快捷鍵、顯示器選擇，以及安全與效能改善。", "Clients & Surfaces", "ChatGPT macOS", "feature", 4, "update", "ChatGPT macOS app release notes", MAC_NOTES, "official_changelog", ["macos", "companion-window"]),
    ("2024-10-17", "Early ChatGPT Windows app", "OpenAI released an early Windows app for Plus, Team, Enterprise and Edu, including an Alt+Space companion window.", "ChatGPT Windows App 早期版本", "OpenAI 向 Plus、Team、Enterprise 與 Edu 推出 Windows App 早期版本，包含 Alt+Space 伴隨視窗。", "Clients & Surfaces", "ChatGPT Windows", "launch", 5, "preview", "Windows App - Release Notes", WINDOWS_NOTES, "official_changelog", ["windows", "desktop"]),
    ("2024-10-30", "Advanced Voice Mode and search on desktop clients", "The macOS and Windows apps added Advanced Voice Mode; Windows added chat-history search, while macOS added o1 model support, Handoff, notifications, find-in-chat, and performance improvements.", "桌面 App 新增進階語音與搜尋", "macOS 與 Windows App 新增進階語音；Windows 加入聊天記錄搜尋，macOS 則加入 o1、Handoff、通知與效能改善。", "Clients & Surfaces", "ChatGPT Desktop", "feature", 4, "update", "Desktop app release notes", MAC_NOTES, "official_changelog", ["macos", "windows", "voice"]),
    ("2024-11-14", "Work with Apps on macOS and screenshots on Windows", "The macOS app began reading supported coding apps in beta, while the Windows app added instant Snipping Tool screenshots and sidebar improvements.", "macOS Work with Apps 與 Windows 截圖", "macOS App 開始以 beta 讀取支援的編碼工具；Windows App 新增 Snipping Tool 截圖與側欄改善。", "Clients & Surfaces", "ChatGPT Desktop", "feature", 4, "beta", "Desktop app release notes", MAC_NOTES, "official_changelog", ["macos", "windows", "work-with-apps"]),
    ("2024-11-26", "Slash commands and more coding apps on macOS", "The macOS app added slash commands for search, reasoning and image generation, plus support for VS Code forks, JetBrains IDEs and more coding tools.", "macOS Slash 指令與更多編碼工具", "macOS App 新增搜尋、推理與生圖 Slash 指令，並擴充 VS Code 分支、JetBrains IDE 等工具支援。", "Clients & Surfaces", "ChatGPT macOS", "feature", 3, "update", "ChatGPT macOS app release notes", MAC_NOTES, "official_changelog", ["macos", "ide"]),
    ("2024-12-19", "Talk with Apps on macOS", "Advanced Voice Mode could work with supported apps; the release also added conversation search and more note-taking and coding integrations.", "macOS Talk with Apps", "進階語音可搭配支援的 App 使用，並新增對話搜尋及更多筆記與編碼工具整合。", "Clients & Surfaces", "ChatGPT macOS", "feature", 4, "update", "ChatGPT macOS app release notes", MAC_NOTES, "official_changelog", ["macos", "voice", "apps"]),
    ("2025-01-15", "Canvas, Tasks and Projects on macOS", "The macOS app added Canvas, Tasks and support for working in existing Projects, alongside attachment, sidebar and table fixes.", "macOS 新增 Canvas、Tasks 與 Projects", "macOS App 新增 Canvas、Tasks 與既有 Projects 支援，並修正附件、側欄及表格問題。", "Clients & Surfaces", "ChatGPT macOS", "feature", 3, "update", "ChatGPT macOS app release notes", MAC_NOTES, "official_changelog", ["macos", "canvas", "tasks"]),
    ("2025-01-30", "Install ChatGPT for Windows with winget", "The Windows app added winget installation support, useful for Enterprise IT-managed deployment.", "Windows App 支援 winget 安裝", "Windows App 新增 winget 安裝方式，便於 Enterprise IT 管理部署。", "Clients & Surfaces", "ChatGPT Windows", "availability", 3, "update", "Windows App - Release Notes", WINDOWS_NOTES, "official_changelog", ["windows", "enterprise", "winget"]),
    ("2025-03-06", "Direct code edits in macOS IDEs", "ChatGPT for macOS gained the ability to edit code directly in supported IDEs.", "macOS 可直接編輯 IDE 程式碼", "ChatGPT macOS App 可在支援的 IDE 中直接編輯程式碼。", "Clients & Surfaces", "ChatGPT macOS", "feature", 4, "update", "ChatGPT macOS app release notes", MAC_NOTES, "official_changelog", ["macos", "ide", "code-editing"]),
    ("2026-07-09", "ChatGPT Classic and the new unified desktop app", "The previous macOS client was renamed ChatGPT Classic as OpenAI launched a new macOS and Windows desktop app combining Chat, ChatGPT Work, and Codex.", "ChatGPT Classic 與新版整合桌面 App", "舊 macOS 客戶端更名為 ChatGPT Classic；新版 macOS/Windows App 整合 Chat、ChatGPT Work 與 Codex。", "Clients & Surfaces", "ChatGPT Desktop", "launch", 5, "launch", "Moving to the new ChatGPT desktop app", "https://help.openai.com/en/articles/20001276/", "official_help_center", ["desktop", "macos", "windows", "codex"]),

    # Atlas release stream and lifecycle.
    ("2025-10-21", "Introducing ChatGPT Atlas", "OpenAI launched ChatGPT Atlas, a macOS browser with ChatGPT built in, Ask ChatGPT, browser memories, inline writing help and an Agent Mode preview.", "推出 ChatGPT Atlas", "OpenAI 推出內建 ChatGPT 的 macOS 瀏覽器 Atlas，包含 Ask ChatGPT、瀏覽器記憶、行內寫作與 Agent Mode 預覽。", "Clients & Surfaces", "ChatGPT Atlas", "launch", 5, "launch", "Introducing ChatGPT Atlas", "https://openai.com/index/introducing-chatgpt-atlas/", "official_launch_post", ["atlas", "browser", "agent"]),
    ("2025-10-23", "Atlas IME input and history deletion", "Atlas fixed Korean and Japanese IME composition and added confirmation before deleting chat history.", "Atlas 輸入法與歷史刪除改善", "Atlas 修正韓文與日文輸入法組字，並在刪除聊天記錄前加入確認。", "Clients & Surfaces", "ChatGPT Atlas", "fix", 1, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "fix"]),
    ("2025-10-28", "Atlas extensions, login, Agent and UI fixes", "Atlas improved extension compatibility and login, added a sidebar model picker, isolated the Agent clipboard, and improved pause/resume reliability.", "Atlas 擴充套件、登入與 Agent 改善", "Atlas 改善擴充套件與登入，新增側欄模型選擇器、Agent 隔離剪貼簿，以及暫停/恢復可靠性。", "Clients & Surfaces", "ChatGPT Atlas", "update", 2, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "extensions", "agent"]),
    ("2025-11-05", "Atlas Projects, Pulse and new tab updates", "Atlas added Projects support to the Ask ChatGPT sidebar, Pulse navigation for eligible users, sticky model selection, Agent scrolling and update reliability fixes.", "Atlas Projects、Pulse 與新分頁更新", "Atlas 在 Ask ChatGPT 側欄加入 Projects、對符合資格用戶加入 Pulse，並改善模型選擇、Agent 滾動與更新可靠性。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "projects", "pulse"]),
    ("2025-11-13", "Atlas bug-fix build 1.2025.309.3", "OpenAI shipped an Atlas maintenance build focused on bug fixes.", "Atlas 1.2025.309.3 錯誤修正", "OpenAI 發布以錯誤修正為主的 Atlas 維護版本。", "Clients & Surfaces", "ChatGPT Atlas", "fix", 1, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "fix"]),
    ("2025-11-18", "Atlas vertical tabs, default search and sidebar insertion", "Atlas added vertical and multi-tab controls, a Google default-search option, insertion from the Ask ChatGPT sidebar, extension import, downloads UI and new shortcuts.", "Atlas 垂直分頁、預設搜尋與側欄插入", "Atlas 新增垂直/多分頁控制、Google 預設搜尋、Ask ChatGPT 插入、擴充匯入、下載介面與快捷鍵。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "tabs", "search"]),
    ("2025-11-25", "Atlas dockable DevTools and browser-memory improvements", "Atlas added dockable DevTools, improved ChatGPT responses using browser memories, polished vertical tabs, and added a safe-search control where permitted.", "Atlas 可停駐 DevTools 與瀏覽器記憶改善", "Atlas 新增可停駐 DevTools、改善運用瀏覽器記憶的回覆、優化垂直分頁，並在允許地區加入安全搜尋控制。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "devtools", "memory"]),
    ("2025-12-09", "Atlas browser memories and vertical-tab updates", "Atlas added a context-menu action to save webpage text into ChatGPT memory, improved vertical tabs, fixed blank results and added Ask ChatGPT onboarding.", "Atlas 瀏覽器記憶與垂直分頁更新", "Atlas 新增將網頁文字存入 ChatGPT 記憶的選單操作，改善垂直分頁與 Ask ChatGPT 新手流程，並修正空白結果。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "memory", "tabs"]),
    ("2025-12-18", "Atlas multi-profile and import controls", "Atlas added multiple browser profiles for one ChatGPT login, component-selective imports, DevTools persistence, recently closed tabs and Agent fixes.", "Atlas 多設定檔與匯入控制", "Atlas 為單一 ChatGPT 登入新增多瀏覽器設定檔、可選擇的匯入項目、DevTools 狀態保留、最近關閉分頁與 Agent 修正。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "profiles", "import"]),
    ("2026-01-15", "Atlas performance, profiles, tabs, imports and DevTools", "Atlas reduced memory overuse and improved the Ask ChatGPT sidebar, profiles, tab search, address-bar behavior, imports, downloads and DevTools.", "Atlas 效能、設定檔、分頁與 DevTools 改善", "Atlas 降低記憶體過度使用，並改善 Ask ChatGPT 側欄、設定檔、分頁搜尋、網址列、匯入、下載與 DevTools。", "Clients & Surfaces", "ChatGPT Atlas", "update", 2, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "performance"]),
    ("2026-01-21", "Atlas tab groups and Auto search", "Atlas added tab groups and an Auto search mode that switches between ChatGPT and Google, plus improved search links and Safari import onboarding.", "Atlas 分頁群組與 Auto 搜尋", "Atlas 新增分頁群組與在 ChatGPT/Google 間切換的 Auto 搜尋，並改善搜尋連結與 Safari 匯入流程。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "tabs", "search"]),
    ("2026-01-28", "Atlas bug-fix build 1.2026.21.3", "OpenAI shipped an Atlas maintenance build focused on bug fixes.", "Atlas 1.2026.21.3 錯誤修正", "OpenAI 發布以錯誤修正為主的 Atlas 維護版本。", "Clients & Surfaces", "ChatGPT Atlas", "fix", 1, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "fix"]),
    ("2026-02-04", "Atlas saved prompts, device emulation and tab renaming", "Atlas added saved prompts, a Device tab in DevTools, tab renaming, smarter Agent/chat transitions and multiple browser fixes.", "Atlas 已存提示、裝置模擬與分頁重新命名", "Atlas 新增已存提示、DevTools 裝置模擬、分頁重新命名、更智慧的 Agent/聊天切換與多項修正。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "prompts", "devtools"]),
    ("2026-02-11", "Atlas smart Ask ChatGPT actions", "Atlas added proactive quick actions and more relevant suggestions for Ask ChatGPT, plus fullscreen, incognito, tab and bookmark fixes.", "Atlas 智慧 Ask ChatGPT 操作", "Atlas 為 Ask ChatGPT 新增主動快速操作與更相關的建議，並修正全螢幕、無痕、分頁與書籤問題。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "ask-chatgpt"]),
    ("2026-02-18", "Atlas revamped tab search and auto-organize", "Atlas expanded tab search across windows and added AI-powered tab auto-organization, duplicate removal and window merging, with performance and input fixes.", "Atlas 全新分頁搜尋與自動整理", "Atlas 擴充分頁搜尋至所有視窗，新增 AI 自動分組、移除重複與合併視窗，並改善效能與輸入。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 4, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "tabs", "ai-organization"]),
    ("2026-02-24", "More persistent Atlas Agent Mode", "Atlas made Agent Mode more persistent on repetitive tasks, added semantic fallback to Find in Page, and fixed tab and keyboard issues.", "更持續執行的 Atlas Agent Mode", "Atlas 讓 Agent Mode 更能持續完成重複工作，為頁面搜尋加入近似匹配，並修正分頁與鍵盤問題。", "Clients & Surfaces", "ChatGPT Atlas", "update", 3, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "agent"]),
    ("2026-03-03", "Atlas bug-fix build 1.2026.56.5", "OpenAI shipped an Atlas maintenance build focused on bug fixes.", "Atlas 1.2026.56.5 錯誤修正", "OpenAI 發布以錯誤修正為主的 Atlas 維護版本。", "Clients & Surfaces", "ChatGPT Atlas", "fix", 1, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "fix"]),
    ("2026-03-10", "Multiple ChatGPT logins in Atlas", "Atlas added multiple ChatGPT account logins, with separate browser profiles for work, personal or school accounts.", "Atlas 支援多個 ChatGPT 登入", "Atlas 新增多 ChatGPT 帳號登入，每個工作、個人或學校帳號可有獨立瀏覽器設定檔。", "Clients & Surfaces", "ChatGPT Atlas", "feature", 4, "update", "ChatGPT Atlas - Release Notes", ATLAS_NOTES, "official_changelog", ["atlas", "accounts", "profiles"]),
    ("2026-07-09", "Atlas deprecation announced", "OpenAI announced that Atlas is being deprecated as browser-agent capabilities move into ChatGPT and Codex; Atlas is scheduled to stop working on August 9, 2026.", "Atlas 宣布棄用", "OpenAI 宣布棄用 Atlas，將瀏覽器代理能力移入 ChatGPT 與 Codex；Atlas 預計於 2026-08-09 停止運作。", "Safety & Lifecycle", "ChatGPT Atlas", "deprecation", 5, "deprecation_announced", "Evolving Atlas into ChatGPT for browser-based agentic work", "https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work", "official_help_center", ["atlas", "deprecation", "browser"]),

    # Enterprise/admin and security landmarks from living official notes.
    ("2025-09-04", "Website blocking for ChatGPT agent", "Enterprise and Edu workspace owners could request blocks for websites or whole domains used by ChatGPT agent browsing and actions.", "ChatGPT agent 網站封鎖", "Enterprise 與 Edu 工作區可要求封鎖 ChatGPT agent 瀏覽與操作的網站或整個網域。", "Safety & Lifecycle", "ChatGPT Enterprise", "feature", 4, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["enterprise", "agent", "security"]),
    ("2025-12-18", "App directory in ChatGPT with enterprise controls", "ChatGPT added an app directory and renamed connectors as apps; Enterprise and Edu admins received RBAC and action controls, while developers could submit Apps SDK apps for review.", "ChatGPT App 目錄與企業控制", "ChatGPT 新增 App 目錄並將 connectors 統整為 apps；Enterprise/Edu 管理員可用 RBAC 與動作控制，開發者可提交 Apps SDK App 審核。", "Developer Platform", "ChatGPT Apps", "launch", 5, "launch", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["apps", "apps-sdk", "enterprise"]),
    ("2026-03-04", "Codex app on Windows for Enterprise and Edu", "The Codex app became available on Windows for Enterprise and Edu workspaces with parallel agents, isolated worktrees and reviewable diffs.", "Enterprise/Edu 的 Codex Windows App", "Codex Windows App 向 Enterprise 與 Edu 開放，支援平行代理、隔離 worktree 與可審查 diff。", "Clients & Surfaces", "Codex Windows", "availability", 4, "launch", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["codex", "windows", "enterprise"]),
    ("2026-03-06", "Skills beta for ChatGPT Enterprise and Edu", "OpenAI introduced workspace-managed Skills in beta for reusable workflows, with role-based creation, sharing and installation controls; the feature was off by default.", "ChatGPT Enterprise/Edu Skills beta", "OpenAI 推出工作區管理的 Skills beta，可重用工作流程並以角色控制建立、分享與安裝；預設關閉。", "Enterprise & Vertical", "ChatGPT Skills", "feature", 4, "beta", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["skills", "enterprise", "beta"]),
    ("2026-03-19", "Legacy deep research mode deprecation", "OpenAI announced that legacy deep research mode would be removed on March 26, while the current deep research experience and historical results would remain.", "舊版 deep research 模式棄用", "OpenAI 宣布舊版 deep research 模式將於 3 月 26 日移除；現行體驗與歷史結果不受影響。", "Safety & Lifecycle", "Deep Research", "deprecation", 4, "deprecation_announced", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["deep-research", "deprecation"]),
    ("2026-04-02", "Codex seats for ChatGPT Enterprise", "OpenAI introduced usage-based Codex-only seats for ChatGPT Enterprise, separate from standard ChatGPT workspace seats.", "ChatGPT Enterprise 新增 Codex 席次", "OpenAI 為 ChatGPT Enterprise 推出按用量計費的 Codex-only 席次，與標準 ChatGPT 工作區席次分開。", "Enterprise & Vertical", "Codex Enterprise", "launch", 4, "launch", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["codex", "enterprise", "pricing"]),
    ("2026-05-22", "Workspace agents generally available", "Workspace agents reached general availability for ChatGPT Business, Enterprise and Edu with action safeguards, admin activity visibility and shared workflows.", "Workspace Agents 正式 GA", "Workspace Agents 向 ChatGPT Business、Enterprise 與 Edu 正式 GA，加入動作防護、管理員活動可視性與可分享流程。", "Agents & Research", "Workspace Agents", "availability", 5, "general_availability", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["workspace-agents", "enterprise", "ga"]),
    ("2026-05-29", "Codex Computer Use and Remote Control on Windows", "Codex added Windows Computer Use and remote control from ChatGPT mobile or Codex on Mac, with Enterprise availability initially disabled and enrollment-gated.", "Codex Windows Computer Use 與遠端控制", "Codex 新增 Windows Computer Use，以及從 ChatGPT mobile 或 Mac 上 Codex 遠端控制；Enterprise 初期預設關閉且需加入早期存取。", "Clients & Surfaces", "Codex Windows", "feature", 4, "preview", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["codex", "windows", "computer-use"]),
    ("2026-06-02", "ChatGPT Sites preview and role-specific Codex plugins", "Enterprise and Edu received a preview of workspace-internal ChatGPT Sites plus role-specific Codex plugins and a wider plugin catalog under workspace controls.", "ChatGPT Sites 預覽與角色型 Codex Plugins", "Enterprise 與 Edu 獲得工作區內部 ChatGPT Sites 預覽、角色型 Codex plugins 與受控的更大 plugin 目錄。", "Enterprise & Vertical", "ChatGPT Sites", "launch", 5, "preview", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["sites", "plugins", "enterprise"]),
    ("2026-06-05", "Plugin sharing for Enterprise workspaces", "Eligible ChatGPT Enterprise workspaces could share local Codex plugins with workspace members; admins could disable sharing through managed configuration.", "Enterprise 工作區 Plugin 分享", "符合資格的 ChatGPT Enterprise 可向成員分享本機 Codex plugins，管理員可透過受管設定停用。", "Enterprise & Vertical", "Codex Plugins", "feature", 4, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["plugins", "codex", "enterprise"]),
    ("2026-06-08", "Connected-app permission controls", "Workspace admins could choose when ChatGPT asks before connected-app use, with workspace and per-app defaults such as Always ask, Any changes and Important actions.", "連接 App 權限控制", "工作區管理員可設定 ChatGPT 使用連接 App 前何時詢問，並提供工作區與單一 App 的 Always ask、Any changes、Important actions 等預設。", "Enterprise & Vertical", "ChatGPT Apps", "feature", 4, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["apps", "permissions", "enterprise"]),
    ("2026-06-11", "Library, Sign in with ChatGPT controls and Codex updates", "Enterprise, Edu and Healthcare received Library; Cloud Console added external-app controls for Sign in with ChatGPT; Codex added Windows Computer Use, developer-mode browser access and more admin controls.", "Library、Sign in with ChatGPT 控制與 Codex 更新", "Enterprise、Edu 與 Healthcare 獲得 Library；Cloud Console 新增外部 App 控制；Codex 加入 Windows Computer Use、瀏覽器開發者模式與更多管理功能。", "Enterprise & Vertical", "ChatGPT Enterprise", "feature", 4, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["library", "admin", "codex"]),
    ("2026-06-17", "Data export for ChatGPT Edu", "Edu members without a data-residency configuration could export workspace data when the admin-enabled export setting was on.", "ChatGPT Edu 資料匯出", "未設定資料落地的 Edu 工作區，可由管理員開啟資料匯出，讓成員匯出工作區資料。", "Enterprise & Vertical", "ChatGPT Edu", "feature", 3, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["edu", "data-export", "admin"]),
    ("2026-06-18", "Usage limits, billing analytics and Codex Record & Replay", "Enterprise and Edu added monthly credit limits plus expanded Global Admin Console billing and analytics; eligible Codex macOS users gained Record & Replay for turning demonstrations into reusable skills.", "用量限制、帳務分析與 Codex Record & Replay", "Enterprise/Edu 新增月度 credit 限制與擴充的帳務/分析；符合資格的 Codex macOS 用戶可將示範轉為可重用 skill。", "Enterprise & Vertical", "ChatGPT Enterprise", "feature", 4, "update", "ChatGPT Enterprise & Edu - Release Notes", ENTERPRISE_NOTES, "official_changelog", ["enterprise", "billing", "record-replay"]),
    ("2026-07-06", "ChatGPT for PowerPoint generally available for Business", "ChatGPT for PowerPoint reached general availability for Business workspaces, while Workspace Agent runs moved to token-based pricing.", "ChatGPT for PowerPoint 在 Business 正式 GA", "ChatGPT for PowerPoint 向 Business 工作區正式 GA；Workspace Agent runs 同步轉為按 token 計價。", "Enterprise & Vertical", "ChatGPT Business", "availability", 4, "general_availability", "ChatGPT Business - Release Notes", BUSINESS_NOTES, "official_changelog", ["business", "powerpoint", "pricing"]),

    # Safety and security framework/product milestones.
    ("2024-09-16", "Independent Safety and Security Committee oversight", "OpenAI said its Safety and Security Committee would become an independent Board oversight committee with authority over model-development and deployment safeguards.", "獨立安全與資安委員會監督", "OpenAI 宣布 Safety and Security Committee 成為獨立董事會監督委員會，監督模型開發與部署安全措施。", "Safety & Lifecycle", "Safety Governance", "safety", 4, "update", "An update on our safety & security practices", "https://openai.com/index/update-on-safety-and-security-practices/", "official_safety_post", ["safety", "governance"]),
    ("2025-04-15", "Updated Preparedness Framework", "OpenAI updated its Preparedness Framework with clearer high-risk criteria, High and Critical capability thresholds, stronger safeguard requirements, and dedicated capability and safeguards reports.", "更新 Preparedness Framework", "OpenAI 更新 Preparedness Framework，明確高風險標準、High/Critical 能力門檻、強化防護要求，以及能力與防護報告。", "Safety & Lifecycle", "Preparedness Framework", "safety", 5, "update", "Our updated Preparedness Framework", "https://openai.com/index/updating-our-preparedness-framework/", "official_safety_post", ["preparedness", "safety", "governance"]),
    ("2025-06-09", "Outbound Coordinated Disclosure Policy", "OpenAI published a policy for coordinated disclosure of vulnerabilities it discovers in third-party software.", "對外協調式漏洞揭露政策", "OpenAI 發布對第三方軟體漏洞的協調式揭露政策。", "Safety & Lifecycle", "Security", "security", 3, "launch", "Scaling coordinated vulnerability disclosure", "https://openai.com/index/scaling-coordinated-vulnerability-disclosure/", "official_security_post", ["security", "vulnerability-disclosure"]),
    ("2025-10-29", "Introducing gpt-oss-safeguard", "OpenAI released research-preview open-weight safety reasoning models in 120B and 20B sizes for policy-based safety classification under Apache 2.0.", "推出 gpt-oss-safeguard", "OpenAI 以 Apache 2.0 發布 120B 與 20B 的開放權重安全推理模型研究預覽，用於依政策進行安全分類。", "Safety & Lifecycle", "gpt-oss-safeguard", "model_release", 4, "preview", "Introducing gpt-oss-safeguard", "https://openai.com/index/introducing-gpt-oss-safeguard/", "official_launch_post", ["safety", "open-weight", "gpt-oss"]),
    ("2026-02-13", "Lockdown Mode and Elevated Risk labels", "OpenAI introduced optional Lockdown Mode for higher-risk users and Elevated Risk labels for capabilities in ChatGPT, Atlas and Codex that may increase prompt-injection exposure.", "Lockdown Mode 與 Elevated Risk 標籤", "OpenAI 推出供高風險用戶選用的 Lockdown Mode，並為 ChatGPT、Atlas 與 Codex 中可能增加 prompt injection 風險的能力加上 Elevated Risk 標籤。", "Safety & Lifecycle", "ChatGPT Security", "security", 5, "launch", "Introducing Lockdown Mode and Elevated Risk labels in ChatGPT", "https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/", "official_security_post", ["lockdown", "prompt-injection", "security"]),
    ("2026-04-30", "Advanced Account Security", "OpenAI introduced an opt-in account setting with stronger protections against unauthorized access to ChatGPT, Codex and sensitive account data.", "Advanced Account Security", "OpenAI 推出選用式帳戶設定，強化 ChatGPT、Codex 與敏感帳戶資料免於未授權存取。", "Safety & Lifecycle", "Account Security", "security", 4, "launch", "Introducing Advanced Account Security", "https://openai.com/index/advanced-account-security/", "official_security_post", ["account-security", "chatgpt", "codex"]),
    ("2026-05-07", "GPT-5.5-Cyber limited preview", "OpenAI began a limited preview of GPT-5.5-Cyber for defenders securing critical infrastructure under Trusted Access for Cyber.", "GPT‑5.5‑Cyber 限量預覽", "OpenAI 透過 Trusted Access for Cyber，向保護關鍵基礎設施的防禦者推出 GPT‑5.5‑Cyber 限量預覽。", "Safety & Lifecycle", "GPT-5.5-Cyber", "model_release", 4, "preview", "Scaling Trusted Access for Cyber with GPT-5.5 and GPT-5.5-Cyber", "https://openai.com/index/gpt-5-5-with-trusted-access-for-cyber/", "official_security_post", ["cybersecurity", "gpt-5.5", "trusted-access"]),
    ("2026-06-22", "Daybreak and updated Codex Security", "OpenAI announced Daybreak for defensive security and an updated Codex Security plugin aimed at finding, prioritizing, fixing and validating vulnerabilities end to end.", "Daybreak 與 Codex Security 更新", "OpenAI 推出防禦型資安方案 Daybreak，並更新 Codex Security plugin，以端到端發現、排序、修補與驗證漏洞。", "Safety & Lifecycle", "Daybreak", "launch", 5, "launch", "Daybreak: Tools for securing every organization in the world", "https://openai.com/index/daybreak-securing-the-world/", "official_security_post", ["daybreak", "codex-security", "cybersecurity"]),
]


def manual_events() -> list[dict]:
    events = []
    for i, row in enumerate(MANUAL, 1):
        (
            date_value,
            title_en,
            summary_en,
            title_zh,
            summary_zh,
            family,
            product,
            event_type,
            importance_value,
            lifecycle,
            source_name,
            source_url,
            source_kind,
            tags,
        ) = row
        events.append(
            make_event(
                event_id=f"platform-manual-{date_value.replace('-', '')}-{i:03d}",
                date_value=date_value,
                title_en=title_en,
                title_zh=title_zh,
                summary_en=summary_en,
                summary_zh=summary_zh,
                product_family=family,
                product=product,
                event_type=event_type,
                importance_value=importance_value,
                lifecycle=lifecycle,
                source_name=source_name,
                source_url=source_url,
                source_kind=source_kind,
                coverage_status="parsed" if source_kind.startswith("official_") else "indexed",
                tags=tags,
            )
        )
    return events


SOURCE_REGISTRY = [
    {"source_id": "platform-src-001", "source_name": "OpenAI API Changelog", "source_url": API_CHANGELOG, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2023-10-06", "to": "2026-07-09"}, "extraction_status": "complete", "event_granularity": "every dated changelog card", "known_gaps": ["The current page begins in October 2023; earlier API events require launch posts."]},
    {"source_id": "platform-src-002", "source_name": "OpenAI API Deprecations", "source_url": API_DEPRECATIONS, "publisher": "OpenAI", "source_kind": "official_deprecation_registry", "time_coverage": {"from": "2022-06-03", "to": "2026-06-11"}, "extraction_status": "complete_in_scope", "event_granularity": "every dated deprecation heading in scope", "known_gaps": ["Rows bundle multiple model shutdowns under one announcement event.", "Living registry may revise replacement recommendations."]},
    {"source_id": "platform-src-003", "source_name": "Codex Changelog", "source_url": CODEX_CHANGELOG, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2025-05-19", "to": "2026-07-09"}, "extraction_status": "complete", "event_granularity": "every release card", "known_gaps": ["Some cards contain many fixes in one release event.", "GitHub package/CLI releases not separately atomized when absent from this page."]},
    {"source_id": "platform-src-004", "source_name": "Apps SDK Changelog", "source_url": APPS_CHANGELOG, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2025-11-04", "to": "2026-06-12"}, "extraction_status": "complete", "event_granularity": "every release card", "known_gaps": ["Pre-launch prototype changes are not represented."]},
    {"source_id": "platform-src-005", "source_name": "ChatGPT macOS app release notes", "source_url": MAC_NOTES, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2024-08-06", "to": "2026-07-09"}, "extraction_status": "parsed_landmarks", "event_granularity": "dated release-note groups", "known_gaps": ["Patch-only details are summarized rather than emitted as separate nodes.", "The page has sparse entries after March 2025 because the product surface changed."]},
    {"source_id": "platform-src-006", "source_name": "Windows App - Release Notes", "source_url": WINDOWS_NOTES, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2024-10-17", "to": "2025-01-30"}, "extraction_status": "parsed_landmarks", "event_granularity": "dated release-note groups", "known_gaps": ["The legacy page stops in January 2025; later desktop changes appear in ChatGPT and Codex notes."]},
    {"source_id": "platform-src-007", "source_name": "ChatGPT Atlas - Release Notes", "source_url": ATLAS_NOTES, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2025-10-21", "to": "2026-03-10"}, "extraction_status": "complete_by_release_date", "event_granularity": "every build/date group", "known_gaps": ["No build notes are listed between March 10 and the July 9 deprecation announcement."]},
    {"source_id": "platform-src-008", "source_name": "ChatGPT Enterprise & Edu - Release Notes", "source_url": ENTERPRISE_NOTES, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2024-12-12", "to": "2026-06-18"}, "extraction_status": "partial_landmarks", "event_granularity": "selected material admin, Codex, app and lifecycle sections", "known_gaps": ["The living page has many connector/model parity entries that overlap the main ChatGPT release notes.", "Not every low-level admin or connector change is atomized in this lane."]},
    {"source_id": "platform-src-009", "source_name": "ChatGPT Business - Release Notes", "source_url": BUSINESS_NOTES, "publisher": "OpenAI", "source_kind": "official_changelog", "time_coverage": {"from": "2025-06-04", "to": "2026-07-06"}, "extraction_status": "partial_landmarks", "event_granularity": "selected plan, admin, Apps SDK and availability milestones", "known_gaps": ["Many feature-parity entries duplicate consumer or Enterprise notes and are left to the corresponding lanes."]},
    {"source_id": "platform-src-010", "source_name": "OpenAI official product launch posts", "source_url": "https://openai.com/news/product/", "publisher": "OpenAI", "source_kind": "official_launch_posts", "time_coverage": {"from": "2023-03-01", "to": "2026-07-09"}, "extraction_status": "targeted", "event_granularity": "selected launches needed to fill changelog gaps", "known_gaps": ["This is not a complete extraction of every OpenAI blog post; only platform/client/business/safety launches in scope were included."]},
    {"source_id": "platform-src-011", "source_name": "OpenAI Security", "source_url": "https://openai.com/news/security/", "publisher": "OpenAI", "source_kind": "official_security_index", "time_coverage": {"from": "2024-09-16", "to": "2026-06-22"}, "extraction_status": "targeted_major_events", "event_granularity": "major public security products and governance changes", "known_gaps": ["Research-only security posts and incident responses are excluded unless they changed a public product, framework, or lifecycle."]},
]


def validate(events: list[dict]) -> None:
    required = {
        "date", "title_en", "title_zh", "summary_en", "summary_zh", "product_family",
        "product", "event_type", "importance", "lifecycle", "source_name", "source_url",
        "source_kind", "coverage_status", "confidence", "tags",
    }
    ids = set()
    for event in events:
        missing = required - event.keys()
        assert not missing, (event.get("event_id"), missing)
        assert event["event_id"] not in ids, event["event_id"]
        ids.add(event["event_id"])
        parsed = datetime.strptime(event["date"], "%Y-%m-%d").date()
        assert SCOPE_START <= parsed <= date(2026, 7, 13), event["event_id"]
        assert 1 <= event["importance"] <= 5
        assert event["source_url"].startswith(("https://openai.com", "https://help.openai.com", "https://developers.openai.com"))
        assert event["confidence"] in {"high", "medium", "low"}


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    events = []
    events.extend(extract_api_changelog())
    events.extend(extract_deprecations())
    events.extend(extract_release_changelog("codex-changelog.html", "codex-", "Codex Changelog", CODEX_CHANGELOG))
    events.extend(extract_release_changelog("apps-changelog.html", "apps-sdk-", "Apps SDK Changelog", APPS_CHANGELOG))
    events.extend(manual_events())
    validate(events)
    events.sort(key=lambda x: (x["date"], x["event_id"]))

    payload = {
        "schema_version": "openai-product-timeline-lane.v0.1",
        "lane": "platform-lifecycle",
        "retrieved_at": RETRIEVED_AT,
        "scope": {
            "from": "2022-11-30",
            "through": "2026-07-13",
            "source_policy": "official OpenAI sources only",
            "focus": ["API platform", "Codex", "Apps SDK and MCP", "desktop clients and Atlas", "Business, Enterprise and Edu administration", "safety, security and lifecycle"],
        },
        "event_count": len(events),
        "events": events,
        "coverage_notes": [
            "API, API deprecations, Codex and Apps SDK changelog pages were extracted at their dated-entry granularity.",
            "Client, business and security launch posts were selected to cover landmarks and known changelog gaps.",
            "Living Help Center pages can be edited retroactively; retrieved_at is therefore material provenance.",
        ],
    }
    (ROOT / "platform-lifecycle.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")

    source_payload = {
        "schema_version": "openai-product-timeline-source-registry.v0.1",
        "lane": "platform-lifecycle",
        "retrieved_at": RETRIEVED_AT,
        "source_policy": "official OpenAI sources only",
        "source_count": len(SOURCE_REGISTRY),
        "sources": SOURCE_REGISTRY,
        "global_gaps": [
            "No single official page contains every OpenAI release across products.",
            "Living changelogs may be rewritten, renamed, consolidated or pruned after publication.",
            "The API changelog currently starts in October 2023, so earlier API milestones are reconstructed from official launch posts and the deprecation registry.",
            "Enterprise/Business notes overlap with the consumer ChatGPT notes; this lane records material administrative and lifecycle changes but not every duplicated feature-parity notice.",
            "Some shutdown dates occur after the research cutoff; those nodes record the announcement date and lifecycle state rather than falsely marking the product already retired.",
        ],
    }
    (ROOT / "platform-source-registry.json").write_text(json.dumps(source_payload, ensure_ascii=False, indent=2) + "\n")

    by_source = Counter(e["source_name"] for e in events)
    by_family = Counter(e["product_family"] for e in events)
    by_year = Counter(e["date"][:4] for e in events)
    report = f"""# Platform and lifecycle research lane

## Executive result

This lane extracted **{len(events)} event records** from **{len(SOURCE_REGISTRY)} official OpenAI source groups** for the period 2022-11-30 through 2026-07-13. The strongest coverage is the dated-entry extraction of the [API changelog]({API_CHANGELOG}), [API deprecation registry]({API_DEPRECATIONS}), [Codex changelog]({CODEX_CHANGELOG}), and [Apps SDK changelog]({APPS_CHANGELOG}).

## Method

- Official OpenAI sources only: `openai.com`, `developers.openai.com`, and `help.openai.com`.
- Every dated API, Codex, Apps SDK, and in-scope API-deprecation card was normalized to the requested bilingual event schema.
- Client, business, education, enterprise, safety, and security notes were added as material product/lifecycle landmarks where they fill a changelog gap or establish a distinct public surface.
- A release-note card remains one event even when the official card bundles several fixes. This preserves source granularity and avoids inventing dates for undated sub-bullets.
- Future shutdown dates are preserved in summaries, but lifecycle is anchored to the announcement state as of 2026-07-13.

## High-confidence claims

1. The current API changelog exposes dated cards from 2023-10-06 through 2026-07-09; this lane captured all {by_source['OpenAI API Changelog']} dated cards visible at retrieval. [Official API changelog]({API_CHANGELOG})
2. The deprecation registry distinguishes deprecation announcements from shutdown and provides recommended replacements; this lane captured {by_source['OpenAI API Deprecations']} in-scope announcement groups. [Official deprecations]({API_DEPRECATIONS})
3. The Codex changelog is its own high-frequency release stream: {by_source['Codex Changelog']} release cards from 2025-05-19 through 2026-07-09 were captured, including app, CLI/IDE, model, mobile and remote-work changes. [Official Codex changelog]({CODEX_CHANGELOG})
4. Apps SDK/MCP changes are independently versioned: {by_source['Apps SDK Changelog']} dated cards were captured from the official SDK changelog. [Official Apps SDK changelog]({APPS_CHANGELOG})
5. ChatGPT desktop evolved through separate macOS and Windows clients, Codex surfaces, and a new unified desktop app; the old macOS client became ChatGPT Classic on 2026-07-09. [macOS notes]({MAC_NOTES}) [Windows notes]({WINDOWS_NOTES}) [migration guide](https://help.openai.com/en/articles/20001276/)
6. Atlas launched on 2025-10-21, received a dated build stream through 2026-03-10, and was announced for shutdown on 2026-08-09 as browser-agent capabilities moved into ChatGPT and Codex. [Atlas notes]({ATLAS_NOTES}) [Atlas transition notice](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work)
7. OpenAI's organizational products form distinct launch/lifecycle nodes: ChatGPT Enterprise (2023-08-28), Team (2024-01-10), Edu (2024-05-30), and the Team-to-Business rename (2025-08-29). [Enterprise](https://openai.com/index/introducing-chatgpt-enterprise/) [Team](https://openai.com/index/introducing-chatgpt-team/) [Edu](https://openai.com/index/introducing-chatgpt-edu/) [Business rename](https://help.openai.com/en/articles/12111915-chatgpt-team-is-now-chatgpt-business)
8. Safety/security milestones are product-relevant nodes when they change controls or public capability governance, including the updated Preparedness Framework, Lockdown Mode, Advanced Account Security, and Daybreak. [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/) [Lockdown Mode](https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/) [Advanced Account Security](https://openai.com/index/advanced-account-security/) [Daybreak](https://openai.com/index/daybreak-securing-the-world/)

## Counts

### By year

{chr(10).join(f'- {year}: {count}' for year, count in sorted(by_year.items()))}

### By product family

{chr(10).join(f'- {family}: {count}' for family, count in sorted(by_family.items()))}

### By primary source stream

{chr(10).join(f'- {source}: {count}' for source, count in by_source.most_common())}

## Contradictions and interpretation risks

- The API deprecation page heading says `2025-08-20: Assistants API`, while its body says developers were notified on 2025-08-26. The dataset uses the official heading date and preserves the notification/removal dates in the summary. This should be manually reviewed before a day-level public visualization.
- The deprecation registry has a heading `2025-09-15: gpt-4o-realtime-preview models` but the prose only says “In September, 2025.” The heading date is used because it is the page's canonical event identifier.
- The GPT-4 API general-availability article shows an updated date in 2024, but its launch event is 2023-07-06. The event date follows the announcement described by the article and deprecation registry, not the later editorial update.
- Help Center release notes are living documents. Their “Updated” timestamp is not the date of each embedded release event and is not used as an event date.
- A scheduled shutdown after 2026-07-13 is not represented as completed retirement. The announcement node remains `deprecation_announced` until a later official source confirms shutdown.

## Gaps and confidence

- **High confidence:** API changelog cards, deprecation headings/tables, Codex cards, Apps SDK cards, and explicit launch/retirement posts.
- **Medium confidence/partial coverage:** Enterprise, Edu and Business admin notes are broad and overlap consumer notes; this lane selects material platform and lifecycle sections rather than claiming every parity bullet is atomized.
- **Known gap:** the legacy Windows release-note page ends in January 2025. Later Windows events are carried by ChatGPT, Enterprise and Codex notes.
- **Known gap:** the Atlas build page has no entries after 2026-03-10 before the July deprecation notice.
- **Known gap:** GitHub release feeds for individual SDK/CLI packages are not treated as canonical product nodes unless surfaced in the official OpenAI changelog.
- **Known gap:** granular API history before October 2023 is not present on the current changelog; five major early platform events were reconstructed from official launch posts.

## Recommended follow-up checks

1. Re-fetch all living changelogs immediately before publishing and diff date headings against this extraction.
2. Resolve the Assistants API 2025-08-20 vs 2025-08-26 date discrepancy with an archived official snapshot or a direct OpenAI correction.
3. Decide whether the final map treats each Codex patch card as a visible node or collapses importance 1–2 cards into monthly “maintenance” clusters.
4. Add a separate shutdown-node pass after future dates actually occur; do not infer retirement solely from a scheduled date.
5. Cross-deduplicate Enterprise/Business parity entries against the consumer timeline while preserving admin-only controls as separate events.

## Validation

- Both JSON files parse successfully.
- Every event has all requested fields, an ISO date, an importance value from 1 to 5, and an official OpenAI URL.
- Event IDs are unique.
- Dates are within the requested research window.
- Source registry explicitly records extraction status and gaps.
"""
    (ROOT / "platform-lifecycle.md").write_text(report)


if __name__ == "__main__":
    main()
