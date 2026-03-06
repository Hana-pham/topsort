import { useEffect, useRef } from "react";
import { Badge } from "./Badge";
import type { RetailerData } from "../types";

// ── Fill Rate ────────────────────────────────────────────────────────

export function FillRate({ retailer }: { retailer: RetailerData }) {
  const fillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fills = fillsRef.current?.querySelectorAll<HTMLElement>(".fill-fill");
    if (!fills) return;
    fills.forEach((el, i) => {
      el.style.width = "0%";
      setTimeout(() => { el.style.width = retailer.categories[i].pct + "%"; }, 80);
    });
  }, [retailer]);

  const emptyCls = retailer.fillBadge.label.includes("EMPTY") || retailer.fillBadge.label.includes("LOW")
    ? "red" : "green";

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Fill Rate by Category</div>
          <div className="panel__sub">Empty slots represent lost ad revenue</div>
        </div>
        <Badge variant={emptyCls}>{retailer.fillBadge.label}</Badge>
      </div>
      <div className="fill-list" ref={fillsRef}>
        {retailer.categories.map((cat) => (
          <div key={cat.name} className="fill-item">
            <div className="fill-dot" style={{ background: cat.color }} />
            <div className="fill-name">
              <div className="fill-title">{cat.name}</div>
              <div className="fill-sub" style={cat.warn ? { color: "var(--red)" } : {}}>
                {cat.sub}
              </div>
            </div>
            <div className="fill-bar-w">
              <div className="fill-track">
                <div
                  className="fill-fill"
                  style={{ background: cat.color, width: `${cat.pct}%`, transition: "width 1s ease" }}
                />
              </div>
              <div className="fill-pct" style={{ color: cat.color }}>{cat.pct}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Alerts ───────────────────────────────────────────────────────────

export function Alerts({ retailer }: { retailer: RetailerData }) {
  const badgeCls = retailer.alertCount >= 4 ? "red" : retailer.alertCount >= 2 ? "amber" : "blue";

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Active Alerts</div>
          <div className="panel__sub">Requires immediate attention</div>
        </div>
        <Badge variant={badgeCls}>{retailer.alertCount} OPEN</Badge>
      </div>
      <div className="al-list">
        {retailer.alerts.map((al, i) => (
          <div key={i} className="al-item">
            <div className={`al-bar al-bar--${al.sev}`} />
            <div className="al-body">
              <div className="al-title">{al.title}</div>
              <div className="al-meta">{al.meta}</div>
            </div>
            <div className="al-time">{al.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pipeline ─────────────────────────────────────────────────────────

const PIPE_ICONS = {
  db:    <><ellipse cx="8" cy="8" rx="7" ry="4.5"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/></>,
  arrow: <path d="M5 3l6 5-6 5"/>,
  fail:  <path d="M4 4l8 8M12 4l-8 8"/>,
  lock:  <><path d="M2 6h12M6 6V4a2 2 0 014 0v2"/><rect x="2" y="6" width="12" height="7" rx="1.5"/></>,
  check: <><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4"/></>,
};

export function Pipeline({ retailer }: { retailer: RetailerData }) {
  const iconKeys = ["db", "arrow", retailer.pipeline.hasIssue ? "fail" : "arrow", "lock", "check"] as const;

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Event Pipeline Health</div>
          <div className="panel__sub">/v2/events · impression to purchase flow</div>
        </div>
        <Badge variant={retailer.pipeline.hasIssue ? "red" : "green"}>
          {retailer.pipeline.hasIssue ? "DROP DETECTED" : "HEALTHY"}
        </Badge>
      </div>

      <div className="pipe-row">
        {retailer.pipeline.steps.map((step, i) => (
          <>
            {i > 0 && (
              <div className={`pipe-conn${!step.ok ? " pipe-conn--warn" : ""}`} />
            )}
            <div key={step.label} className="pipe-step">
              <div className={`pipe-icon pipe-icon--${step.ok ? "ok" : "fail"}`}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {PIPE_ICONS[iconKeys[i]]}
                </svg>
              </div>
              <div className="pipe-name">{step.label}</div>
              <div className={`pipe-count pipe-count--${step.ok ? "green" : "red"}`}>{step.count}</div>
            </div>
          </>
        ))}
      </div>

      <div className={`pipe-note${!retailer.pipeline.hasIssue ? " pipe-note--ok" : ""}`}>
        <strong>{retailer.pipeline.hasIssue ? "WHY THIS MATTERS" : "ALL CLEAR"}</strong>
        {retailer.pipeline.note}
      </div>
    </div>
  );
}

// ── Endpoints ────────────────────────────────────────────────────────

export function Endpoints({ retailer }: { retailer: RetailerData }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">API Endpoint Status</div>
          <div className="panel__sub">api.topsort.com/v2 · uptime last 90 days</div>
        </div>
        <Badge variant="green">ALL OPERATIONAL</Badge>
      </div>
      <table className="ep-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Latency</th>
            <th>90-Day Uptime</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {retailer.endpoints.map((ep) => (
            <tr key={ep.path}>
              <td>
                <span className={`mtag mtag--${ep.method.toLowerCase()}`}>{ep.method}</span>
                <span className="ep-name">{ep.path}</span>
              </td>
              <td>
                <span className="lat-val" style={{ color: ep.latColor }}>{ep.lat}</span>
              </td>
              <td>
                <div className="up-bar">
                  {ep.segs.map((s, i) => (
                    <div key={i} className={`up-seg${s === 1 ? " up-seg--miss" : s === 2 ? " up-seg--slow" : ""}`} />
                  ))}
                </div>
              </td>
              <td>
                <Badge variant={ep.uptimeCls}>{ep.uptime}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
