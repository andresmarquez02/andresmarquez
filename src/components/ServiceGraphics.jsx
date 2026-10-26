import { AI_SESSION } from "../data/content";
import { useInView } from "../hooks/useInView";

/* ───────── A · code editor ───────── */
// Each token is [text, className]; the snippet is the ERP's "notify after commit" rule.
const CODE = [
  [["class ", "k"], ["SyncCustomer", "c"]],
  [["{", "p"]],
  [["    public function ", "k"], ["handle", "f"], ["(", "p"], ["Customer ", "c"], ["$customer", "v"], ["): ", "p"], ["void", "k"]],
  [["    {", "p"]],
  [["        DB", "c"], ["::", "p"], ["transaction", "f"], ["(", "p"], ["fn ", "k"], ["() => ", "p"], ["$customer", "v"], ["->", "p"], ["save", "f"], ["());", "p"]],
  [["        // a CRM outage never rolls back the ERP", "m"]],
  [["        dispatch", "f"], ["(", "p"], ["new ", "k"], ["NotifyGoHighLevel", "c"], ["(", "p"], ["$customer", "v"], ["));", "p"]],
  [["    }", "p"]],
  [["}", "p"]],
];

export function GraphicCode() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`gfx-code ${seen ? "is-in" : ""}`}>
      <div className="gfx-code-tabs" aria-hidden>
        <span className="dots"><i /><i /><i /></span>
        <span className="tab on">SyncCustomer.php</span>
        <span className="tab">OrderList.vue</span>
        <span className="tab">routes/api.php</span>
      </div>
      <pre aria-label="Laravel code sample">
        {CODE.map((line, i) => (
          <span key={i} className="ln" style={{ "--i": i }}>
            <span className="no" aria-hidden>{i + 1}</span>
            {line.map(([text, cls], j) => (
              <span key={j} className={`t-${cls}`}>{text}</span>
            ))}
          </span>
        ))}
        <span className="ln" style={{ "--i": CODE.length }}>
          <span className="no" aria-hidden>{CODE.length + 1}</span>
          <span className="cur" aria-hidden />
        </span>
      </pre>
      <div className="gfx-code-status" aria-hidden>
        <span>PHP 8.3</span>
        <span>Laravel · Vue · Tailwind</span>
        <span>PHPStan 8 ✓</span>
      </div>
    </div>
  );
}

/* ───────── B · n8n-style workflow canvas ───────── */
const NODES = [
  { id: "hook", x: 70, y: 130, label: "Webhook", color: "#ff6d5a", icon: "M13 2 4 14h6l-1 8 9-12h-6z", trigger: true },
  { id: "ai", x: 205, y: 130, label: "Gemini", color: "#8e75ff", icon: "M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z" },
  { id: "if", x: 335, y: 130, label: "IF", color: "#3b82f6", icon: "M6 4v8a4 4 0 0 0 4 4h8M6 4 3 7M6 4l3 3M18 16l-3-3M18 16l-3 3" },
  { id: "db", x: 480, y: 66, label: "Supabase", color: "#3ecf8e", icon: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" },
  { id: "mail", x: 480, y: 194, label: "Gmail", color: "#ea4335", icon: "M3 6h18v12H3zM3 7l9 7 9-7" },
];
const EDGES = [
  ["hook", "ai"],
  ["ai", "if"],
  ["if", "db"],
  ["if", "mail"],
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const edgePath = (a, b) => {
  const from = byId[a];
  const to = byId[b];
  const x1 = from.x + 28;
  const x2 = to.x - 28;
  const mid = (x1 + x2) / 2;
  return `M${x1} ${from.y} C${mid} ${from.y}, ${mid} ${to.y}, ${x2} ${to.y}`;
};

export function GraphicN8n() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`gfx-n8n ${seen ? "is-in" : ""}`}>
      <svg viewBox="0 0 560 260" role="img" aria-label="n8n workflow: Webhook, Gemini, IF, Supabase and Gmail">
        <defs>
          <pattern id="n8n-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" className="n8n-dot" />
          </pattern>
        </defs>
        <rect width="560" height="260" fill="url(#n8n-dots)" />
        {EDGES.map(([a, b], i) => (
          <g key={`${a}-${b}`}>
            <path d={edgePath(a, b)} className="n8n-edge" />
            <path d={edgePath(a, b)} className="n8n-flow" style={{ "--d": `${i * 0.35}s` }} />
          </g>
        ))}
        {NODES.map((n, i) => (
          <g key={n.id} className="n8n-node" style={{ "--i": i }} transform={`translate(${n.x} ${n.y})`}>
            <rect x="-28" y="-28" width="56" height="56" rx={n.trigger ? 28 : 14} className="n8n-box" style={{ "--c": n.color }} />
            {n.trigger && <rect x="-28" y="-28" width="56" height="56" rx="28" className="n8n-pulse" style={{ "--c": n.color }} />}
            <g transform="translate(-11 -11) scale(0.92)" fill="none" stroke={n.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={n.icon} />
            </g>
            <text y="46" textAnchor="middle" className="n8n-label">{n.label}</text>
          </g>
        ))}
        <g transform="translate(16 228)" className="n8n-run">
          <rect width="118" height="24" rx="12" />
          <text x="59" y="16" textAnchor="middle">▶ Execute workflow</text>
        </g>
      </svg>
    </div>
  );
}

/* ───────── C · agent terminal ───────── */
export function GraphicTerminal({ t }) {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`gfx-term ${seen ? "is-in" : ""}`}>
      <div className="dots" aria-hidden><i /><i /><i /><span>~/erp — claude</span></div>
      {AI_SESSION.map(({ cmd, note }, i) => (
        <div key={cmd} className="ln" style={{ "--i": i }}>
          <span className="prompt">›</span>
          <span className="cmd">{cmd}</span> <span className="note"># {t(note)}</span>
        </div>
      ))}
      <div className="ln" style={{ "--i": AI_SESSION.length }}><span className="prompt">›</span><span className="cur" aria-hidden /></div>
    </div>
  );
}

/* ───────── Data pipeline run (MContigo case in Work) ───────── */
const PIPELINE = [
  ["cmd", "python daily_check.py --markets es,it"],
  ["ok", "catalog loaded with pandas"],
  ["ok", "rules validated against the real data"],
  ["ok", "products without UID / Child ASIN flagged"],
  ["ok", "first-detection and resolution dates updated"],
  ["ok", "published to Google Sheets through the API"],
];

export function GraphicPipeline() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`gfx-term gfx-term--lg ${seen ? "is-in" : ""}`}>
      <div className="dots" aria-hidden><i /><i /><i /><span>~/mcontigo — cron 06:00</span></div>
      {PIPELINE.map(([kind, text], i) => (
        <div key={text} className="ln" style={{ "--i": i }}>
          {kind === "cmd" ? <span className="prompt">›</span> : <span className="ok">✓</span>}
          <span className={kind === "cmd" ? "cmd" : "note"}>{text}</span>
        </div>
      ))}
      <div className="ln" style={{ "--i": PIPELINE.length }}><span className="prompt">›</span><span className="cur" aria-hidden /></div>
    </div>
  );
}

/* ───────── D · test runner ───────── */
const BROWSERS = ["Chromium", "Firefox", "WebKit"];
const CHECKS = ["Responsive", "Forms", "Security headers", "Maps", "OWASP ZAP scan"];

export function GraphicTests() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`gfx-tests ${seen ? "is-in" : ""}`}>
      <div className="gfx-browsers">
        {BROWSERS.map((name, i) => (
          <div key={name} className="gfx-browser" style={{ "--i": i }}>
            <div className="gfx-win" aria-hidden>
              <span className="bar"><i /><i /><i /></span>
              <span className="sk w60" />
              <span className="sk w90" />
              <span className="sk w40" />
              <span className="scan" />
            </div>
            <div className="gfx-browser-foot">
              <b>{name}</b>
              <span className="ok" aria-label="passed">✓</span>
            </div>
            <span className="gfx-progress"><i /></span>
          </div>
        ))}
      </div>
      <ul className="gfx-chips">
        {CHECKS.map((c, i) => (
          <li key={c} style={{ "--i": i }}>
            <span aria-hidden>✓</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
