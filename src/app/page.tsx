"use client";

import { useState, useEffect } from "react";
import type { RetailerId }     from "@/types/topsort";
import { getAllRetailers }      from "@/lib/topsort";
import { Sidebar }             from "@/components/Sidebar";
import { KpiStrip }            from "@/components/KpiStrip";
import { LatencyChart }        from "@/components/LatencyChart";
import { FillRate }            from "@/components/FillRate";
import { AlertsList }          from "@/components/AlertsList";
import { Pipeline }            from "@/components/Pipeline";
import { EndpointTable }       from "@/components/EndpointTable";

const RETAILERS = getAllRetailers();

export default function Dashboard() {
  const [activeId, setActiveId]   = useState<RetailerId>("woolworths");
  const [clock, setClock]         = useState("");
  const [alertCount, setAlertCount] = useState(0);

  const retailer = RETAILERS[activeId];

  // UTC clock
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = (x: number) => String(x).padStart(2, "0");
      setClock(`${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Update alert count on retailer change
  useEffect(() => {
    setAlertCount(retailer.alertCount);
  }, [activeId, retailer.alertCount]);

  const alertPillCls =
    alertCount >= 4 ? "bg-red-50 text-brand-red border-red-200"
    : alertCount >= 2 ? "bg-amber-50 text-brand-amber border-amber-200"
    : "bg-green-50 text-brand-green border-green-200";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — fixed width */}
      <div className="w-[220px] flex-shrink-0">
        <Sidebar
          retailers={RETAILERS}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto animate-fade-up">

        {/* Topbar */}
        <div className="flex items-center justify-between px-7 py-4 bg-white border-b border-black/[0.07] sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="font-serif text-[20px] font-bold tracking-tight">
              Integration Health
            </h1>
            <p className="text-[12px] text-ink-muted mt-0.5 transition-all duration-300">
              {retailer.name} — Real-time monitoring across auction, events, and fill rate
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-mono border transition-all duration-300 ${alertPillCls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {alertCount} {alertCount === 1 ? "ALERT OPEN" : "ALERTS OPEN"}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-mono border bg-green-50 text-brand-green border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-green" />
              API OPERATIONAL
            </span>
            <span className="text-[11px] font-mono text-ink-muted bg-cream-2 border border-black/[0.07] px-2.5 py-1.5 rounded-lg">
              {clock}
            </span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="px-7 py-6 flex-1">

          {/* KPIs */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-2.5">
            Key Metrics — Today
          </div>
          <KpiStrip kpi={retailer.kpi} alertCount={alertCount} />

          {/* Main panels */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-2.5">
            Live Panels
          </div>
          <div className="grid grid-cols-[1fr_1fr_300px] gap-3 mb-3">
            <LatencyChart
              retailerId={activeId}
              latencyStats={retailer.latencyStats}
              slaBadge={retailer.slaBadge}
            />
            <FillRate
              categories={retailer.categories}
              fillBadge={retailer.fillBadge}
            />
            <AlertsList
              alerts={retailer.alerts}
              alertCount={retailer.alertCount}
            />
          </div>

          {/* Bottom panels */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-2.5">
            Data Pipeline and API Endpoints
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Pipeline pipeline={retailer.pipeline} />
            <EndpointTable endpoints={retailer.endpoints} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-3.5 flex items-center justify-between bg-white border-t border-black/[0.07]">
          <div className="text-[10.5px] font-mono text-ink-muted">
            Built on{" "}
            <span className="text-ts">Topsort v2 API</span>
            {" "}· docs.topsort.com · github.com/Topsort ·{" "}
            <span className="text-ink-mid">Concept by Hana Pham</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-ts animate-pulse-orange" />
            Refreshing every 30 seconds
          </div>
        </div>
      </main>
    </div>
  );
}
