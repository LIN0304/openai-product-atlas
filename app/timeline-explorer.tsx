"use client";

import { useEffect, useMemo, useState } from "react";

type TimelineEvent = {
  event_id: string; date: string; year: number; quarter: string; era: string;
  product_family: string; product: string; event_type: string;
  title_en: string; title_zh: string; summary_en: string; summary_zh: string;
  importance: number; node_tier: "landmark" | "milestone" | "update"; lifecycle: string;
  map_region: string; glyph: string; color: string; source_name: string; source_url: string;
  source_refs: Array<{ id: string; name: string; url: string }>; confidence: string;
};

type Family = { id: string; name_en: string; name_zh: string; region: string; glyph: string; color: string; lane: number };
export type InitialFilters = {
  query: string;
  family: string;
  year: string;
  landmarksOnly: boolean;
  selectedId: string;
};
export type Dataset = {
  generated_at: string;
  period: { start: string; cutoff: string; latest_event: string };
  stats: { raw_official_entries: number; canonical_map_nodes: number; landmarks: number; official_source_records: number; product_families: number; cross_source_corroborations: number };
  taxonomy: Family[];
  events: TimelineEvent[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function compactType(type: string) { return type.replaceAll("_", " ").toUpperCase(); }

export function TimelineExplorer({ initialData, initialFilters }: { initialData: Dataset; initialFilters: InitialFilters }) {
  const [data] = useState<Dataset>(initialData);
  const [query, setQuery] = useState(initialFilters.query);
  const [family, setFamily] = useState(initialFilters.family);
  const [year, setYear] = useState(initialFilters.year);
  const [landmarksOnly, setLandmarksOnly] = useState(initialFilters.landmarksOnly);
  const [selectedId, setSelectedId] = useState(initialFilters.selectedId || initialData.events[0]?.event_id || "");
  const [visibleCount, setVisibleCount] = useState(72);
  const [godotReady, setGodotReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The iframe can finish its initial document load before React hydrates and
    // attaches onLoad. Reveal it after a short fallback so the running Godot
    // canvas is never left permanently transparent.
    const initialScrollY = window.scrollY;
    const fallback = window.setTimeout(() => {
      setGodotReady(true);
      const frame = document.querySelector<HTMLIFrameElement>(".godot-embed");
      if (frame && document.activeElement === frame) {
        frame.blur();
        window.scrollTo({ top: initialScrollY, behavior: "instant" });
      }
    }, 1600);
    return () => window.clearTimeout(fallback);
  }, []);

  const years = useMemo(() => data ? [...new Set(data.events.map((event) => event.year))].sort() : [2022, 2023, 2024, 2025, 2026], [data]);
  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = query.trim().toLocaleLowerCase();
    return data.events.filter((event) => {
      if (family !== "all" && event.product_family !== family) return false;
      if (year !== "all" && String(event.year) !== year) return false;
      if (landmarksOnly && event.node_tier !== "landmark") return false;
      if (!needle) return true;
      return [event.title_en, event.title_zh, event.summary_en, event.summary_zh, event.product, event.map_region].join(" ").toLocaleLowerCase().includes(needle);
    });
  }, [data, family, landmarksOnly, query, year]);
  const selected = useMemo(() => filtered.find((event) => event.event_id === selectedId) ?? filtered[0] ?? data.events.find((event) => event.event_id === selectedId) ?? data.events[0], [data, filtered, selectedId]);
  const effectiveSelectedId = selected?.event_id ?? selectedId;

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (family !== "all") params.set("family", family);
    if (year !== "all") params.set("year", year);
    if (landmarksOnly) params.set("landmarks", "1");
    if (effectiveSelectedId) params.set("event", effectiveSelectedId);
    const suffix = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${suffix ? `?${suffix}` : ""}`);
  }, [effectiveSelectedId, family, landmarksOnly, query, year]);

  const stats = data.stats;
  const terminalLines = [
    "> BOOT PRODUCT_ATLAS v0.1",
    `> LOAD OFFICIAL_SOURCES .... ${String(stats.official_source_records).padStart(2, "0")}`,
    `> INDEX CANONICAL_NODES .... ${stats.canonical_map_nodes}`,
    `> MARK LANDMARKS ........... ${String(stats.landmarks).padStart(2, "0")}`,
    `> MAP PRODUCT_REGIONS ...... ${String(stats.product_families).padStart(2, "0")}`,
    "> GODOT_RUNTIME ............ READY",
    "> EXPLORE THE ARCHIVE_",
  ];

  function resetFilters() { setQuery(""); setFamily("all"); setYear("all"); setLandmarksOnly(false); setVisibleCount(72); }
  async function copyLink() { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }

  return (
    <main className="atlas-shell">
      <a className="skip-link" href="#event-index">跳至事件索引</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="OpenAI Product Atlas home"><span className="wordmark-glyph" aria-hidden="true">@</span><span>OPENAI // PRODUCT ATLAS</span></a>
        <nav aria-label="Primary navigation"><a href="#world">WORLD</a><a href="#event-index">INDEX</a><a href="#methodology">METHOD</a></nav>
        <span className="live-status"><i /> ARCHIVE ONLINE</span>
      </header>

      <section className="atlas-hero" id="top">
        <div className="hero-copy">
          <p className="kicker">CANONICAL OFFICIAL-SOURCE BASELINE // v0.1</p>
          <h1>從 ChatGPT<br />到 <span>Sol.</span></h1>
          <p className="hero-lede">把 OpenAI 的產品史做成一個可以行走、縮放與查證的像素世界。每個節點都是一次正式發布、更新、開放、淘汰或退役。</p>
        </div>
        <div className="hero-terminal" aria-label="Dataset status">
          <div className="terminal-bar"><span>SYS.LOG</span><span>2022.11.30 → 2026.07.09</span></div>
          <pre>{terminalLines.join("\n")}</pre>
        </div>
      </section>

      <section className="stat-ribbon" aria-label="Dataset statistics">
        <div><strong>{stats.canonical_map_nodes}</strong><span>EVENT NODES</span></div><div><strong>{stats.landmarks}</strong><span>LANDMARKS</span></div><div><strong>{stats.official_source_records}</strong><span>OFFICIAL SOURCE GROUPS</span></div><div><strong>{stats.product_families}</strong><span>MAP REGIONS</span></div><div><strong>{stats.raw_official_entries}</strong><span>RAW SOURCE RECORDS</span></div>
      </section>

      <section className="world-section" id="world">
        <div className="section-heading"><div><p className="kicker">01 // PLAYABLE ARCHIVE</p><h2>產品世界地圖</h2></div><p>拖曳平移 · 滾輪／手勢縮放 · 點擊節點 · WASD／方向鍵移動 · A 切換 ASCII · Enter 讀取最近事件</p></div>
        <div className="godot-frame">
          <div className="frame-chrome"><span><i /> GODOT 4.7 // WEB RUNTIME</span><span>{godotReady ? "WORLD LOADED" : "LOADING WORLD…"}</span></div>
          {!godotReady && <div className="loading-grid" aria-hidden="true"><span>@</span><b>BUILDING TIMELINE TOPOLOGY…</b></div>}
          <iframe className={godotReady ? "godot-embed ready" : "godot-embed"} src="/godot/index.html" title="OpenAI Product Atlas interactive Godot timeline" allow="autoplay; fullscreen" onLoad={(event) => { event.currentTarget.blur(); setGodotReady(true); }} />
        </div>
        <div className="map-legend" aria-label="Map region legend">
          {(data?.taxonomy ?? []).map((item) => <button key={item.id} onClick={() => { setFamily(item.id); document.getElementById("event-index")?.scrollIntoView({ behavior: "smooth" }); }}><b style={{ color: item.color }}>{item.glyph}</b><span>{item.region}<small>{item.name_zh}</small></span></button>)}
        </div>
      </section>

      <section className="index-section" id="event-index">
        <div className="section-heading index-heading"><div><p className="kicker">02 // MACHINE-READABLE INDEX</p><h2>事件索引</h2></div><div className="download-row" aria-label="Dataset downloads"><a href="/data/openai-product-timeline-v0.1.json" download>JSON ↓</a><a href="/data/openai-product-timeline-v0.1.csv" download>CSV ↓</a><a href="/data/openai-product-timeline-v0.1.xlsx" download>XLSX ↓</a><a href="/data/openai-product-timeline-raw-v0.1.json" download>RAW ↓</a></div></div>

        <div className="filter-panel">
          <label className="search-field"><span>SEARCH / 搜尋</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(72); }} placeholder="GPT-4o, Codex, Voice, 退役…" /></label>
          <label><span>REGION / 區域</span><select value={family} onChange={(event) => { setFamily(event.target.value); setVisibleCount(72); }}><option value="all">ALL REGIONS</option>{data?.taxonomy.map((item) => <option key={item.id} value={item.id}>{item.glyph} {item.region}</option>)}</select></label>
          <label><span>YEAR / 年份</span><select value={year} onChange={(event) => { setYear(event.target.value); setVisibleCount(72); }}><option value="all">ALL YEARS</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="check-field"><input type="checkbox" checked={landmarksOnly} onChange={(event) => { setLandmarksOnly(event.target.checked); setVisibleCount(72); }} /><span>LANDMARKS ONLY<br /><small>只顯示主要地標</small></span></label>
          <button className="reset-button" onClick={resetFilters}>RESET ↺</button>
        </div>

        <div className="index-layout">
          <aside className="event-detail" aria-live="polite">
            {selected && <>
              <div className="detail-code"><span>{selected.glyph} {selected.map_region}</span><span>{selected.event_id}</span></div>
              <time>{formatDate(selected.date)}{" // "}{selected.quarter}</time><p className="detail-type">{compactType(selected.event_type)} · {selected.lifecycle.toUpperCase()}</p>
              <h3>{selected.title_zh}</h3><h4>{selected.title_en}</h4><p>{selected.summary_zh}</p><p className="summary-en">{selected.summary_en}</p>
              <dl><div><dt>PRODUCT</dt><dd>{selected.product}</dd></div><div><dt>ERA</dt><dd>{selected.era}</dd></div><div><dt>CONFIDENCE</dt><dd>{selected.confidence.toUpperCase()}</dd></div><div><dt>NODE</dt><dd>{selected.node_tier.toUpperCase()} / {selected.importance}</dd></div></dl>
              <div className="detail-actions"><a href={selected.source_url} target="_blank" rel="noreferrer">OPEN OFFICIAL SOURCE ↗</a><button onClick={copyLink}>{copied ? "COPIED ✓" : "COPY DEEP LINK"}</button></div>
              {selected.source_refs.length > 1 && <div className="corroboration"><span>CORROBORATED BY</span>{selected.source_refs.slice(1).map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</div>}
            </>}
          </aside>
          <div className="event-list">
            <div className="event-list-head"><span>{filtered.length} MATCHING NODES</span><span>DATE / EVENT / REGION</span></div>
            {filtered.slice(0, visibleCount).map((event) => <button key={event.event_id} className={selected?.event_id === event.event_id ? "event-row selected" : "event-row"} onClick={() => setSelectedId(event.event_id)}><time>{event.date}</time><span className="event-marker" style={{ color: event.color }}>{event.glyph}{event.node_tier === "landmark" ? "◆" : "·"}</span><span className="event-title"><b>{event.title_zh}</b><small>{event.title_en}</small></span><span className="event-region">{event.map_region}<small>{compactType(event.event_type)}</small></span></button>)}
            {!filtered.length && <p className="empty-state">NO SIGNAL // 沒有符合條件的事件節點。</p>}
            {visibleCount < filtered.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + 72)}>LOAD 72 MORE NODES ↓</button>}
          </div>
        </div>
      </section>

      <section className="method-section" id="methodology">
        <div className="section-heading"><div><p className="kicker">03 // PROVENANCE BEFORE SPECTACLE</p><h2>方法與邊界</h2></div><p>截至 2026-07-13 擷取；事件時間終點為 2026-07-09。官方頁面會回溯修改，因此每次重建都應重新驗證。</p></div>
        <div className="method-grid"><article><span>01</span><h3>OFFICIAL-FIRST</h3><p>只把 OpenAI 官方 launch posts、Help Center release notes 與 developers/platform changelogs 當作事件證據。</p></article><article><span>02</span><h3>ONE NODE, ONE EVENT</h3><p>一篇 release note 可以拆成多個獨立節點；相近標題、日期與產品會合併並保留交叉來源。</p></article><article><span>03</span><h3>VISIBLE COVERAGE</h3><p>326 個節點是為地圖策展的 canonical layer；{stats.raw_official_entries} 筆 raw records 另行保存，方便追查遺漏與重新抽取。</p></article><article><span>04</span><h3>NO FALSE COMPLETENESS</h3><p>OpenAI 的更新分散且 living pages 會變動。v0.1 是可重現的官方來源基準，不宣稱數學上涵蓋每個內部變更。</p></article></div>
        <div className="source-register"><span>PRIMARY SOURCE ENTRY POINTS</span><div><a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer">CHATGPT NOTES ↗</a><a href="https://help.openai.com/en/articles/9624314-model-release-notes" target="_blank" rel="noreferrer">MODEL NOTES ↗</a><a href="https://platform.openai.com/docs/changelog" target="_blank" rel="noreferrer">API CHANGELOG ↗</a><a href="https://developers.openai.com/codex/changelog/" target="_blank" rel="noreferrer">CODEX CHANGELOG ↗</a></div></div>
      </section>

      <footer className="site-footer"><div className="wordmark"><span className="wordmark-glyph">@</span><span>OPENAI // PRODUCT ATLAS</span></div><p>Built as a native Godot 4.7 world + an accessible, source-linked web archive.</p><span>DATASET v0.1 // 2026</span></footer>
    </main>
  );
}
