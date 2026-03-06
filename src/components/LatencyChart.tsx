"use client";

import type { LatencyStats, SlaBadge, RetailerId } from "@/types/topsort";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface LatencyChartProps {
  retailerId:   RetailerId;
  latencyStats: LatencyStats;
  slaBadge:     SlaBadge;
}

const LATENCY_PROFILES: Record<RetailerId, number[]> = {
  woolworths: [44,38,41,36,33,37,53,60,58,48,45,43,40,38,41,44,46,42,40,43,41],
  coles:      [50,46,48,42,40,44,58,52,50,48,47,46,43,41,44,47,49,45,43,46,44],
  trademe:    [35,30,33,28,26,30,42,38,36,34,33,31,28,26,30,33,35,31,29,32,30],
  poshmark:   [38,34,36,31,29,33,40,36,34,32,31,29,27,25,29,32,34,30,28,31,29],
  doordash:   [56,52,54,50,48,52,70,74,68,60,57,55,52,50,54,57,59,55,53,56,54],
};

const LABELS = ["00:00","","02:00","","04:00","","06:00","","08:00","","10:00","","12:00","","14:00","","16:00","","18:00","","now"];

export function LatencyChart({ retailerId, latencyStats, slaBadge }: LatencyChartProps) {
  const data = LATENCY_PROFILES[retailerId];
  const mx = Math.max(...data);

  return (
    <Panel>
      <PanelHeader
        title="Auction Latency — Last 24 Hours"
        subtitle="/v2/auctions · P50 / P95 / P99 percentiles"
        badge={<Badge cls={slaBadge.cls} label={slaBadge.label} />}
      />
      <div className="px-4 py-4">
        {/* Bars */}
        <div className="flex items-end gap-[3px] h-24">
          {data.map((h, i) => {
            const hp = (h / mx) * 88;
            const SLA_LINE_H = (55 / mx) * 88;
            const type = h > mx * 0.9 ? "spike" : h > mx * 0.75 ? "warn" : h < mx * 0.55 ? "good" : "normal";
            const barClass = {
              spike:  "bg-red-100 border border-red-200 border-b-0",
              warn:   "bg-[#FFE5D9] border border-ts/30 border-b-0",
              good:   "bg-green-50 border border-green-200 border-b-0",
              normal: "bg-ts-pale border border-ts/18 border-b-0",
            }[type];

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-full flex items-end relative" style={{ height: 88 }}>
                  {/* SLA reference line */}
                  {i === 7 && (
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-brand-red opacity-50"
                      style={{ bottom: SLA_LINE_H }}
                    >
                      <span className="absolute right-0 text-[8px] text-brand-red font-mono whitespace-nowrap" style={{ bottom: 2 }}>
                        10ms SLA
                      </span>
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-[3px] transition-all duration-700 ease-out group-hover:opacity-65 ${barClass}`}
                    style={{ height: hp }}
                  />
                </div>
                <span className="text-[8.5px] text-ink-faint font-mono">{LABELS[i]}</span>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 mt-3 pt-3 border-t border-black/[0.07]">
          {[
            { label: "P50 median", val: latencyStats.p50, color: "text-brand-green" },
            { label: "P95 current", val: latencyStats.p95, color: "text-ts" },
            { label: "P99 worst",   val: latencyStats.p99, color: "text-brand-amber" },
            { label: "SLA ceiling", val: "10ms",           color: "text-ink-muted" },
          ].map(({ label, val, color }) => (
            <div key={label} className="px-1.5 border-r border-black/[0.07] last:border-0">
              <div className="text-[9px] font-mono text-ink-muted mb-0.5">{label}</div>
              <div className={`font-serif text-[17px] font-bold tracking-tight transition-all duration-300 ${color}`}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
