"use client";

import type { RetailerData } from "@/types/topsort";

interface KpiStripProps {
  kpi:       RetailerData["kpi"];
  alertCount: number;
}

type KpiColor = "orange" | "blue" | "amber" | "red" | "green";

const KPI_CONFIG: Array<{
  key:   keyof RetailerData["kpi"];
  label: string;
  color: KpiColor;
}> = [
  { key: "latency",   label: "Auction Latency P95", color: "orange" },
  { key: "apm",       label: "Auctions / min",       color: "blue"   },
  { key: "fill",      label: "Overall Fill Rate",    color: "amber"  },
  { key: "drop",      label: "Event Drop Rate",      color: "red"    },
  { key: "campaigns", label: "Active Campaigns",     color: "green"  },
];

const colorStyles: Record<KpiColor, { val: string; bar: string }> = {
  orange: { val: "text-ts",          bar: "bg-ts"          },
  blue:   { val: "text-brand-blue",  bar: "bg-brand-blue"  },
  amber:  { val: "text-brand-amber", bar: "bg-brand-amber" },
  red:    { val: "text-brand-red",   bar: "bg-brand-red"   },
  green:  { val: "text-brand-green", bar: "bg-brand-green" },
};

export function KpiStrip({ kpi, alertCount: _ }: KpiStripProps) {
  return (
    <div className="grid grid-cols-5 gap-2.5 mb-5">
      {KPI_CONFIG.map(({ key, label, color }) => {
        const metric = kpi[key];
        const styles = colorStyles[color];
        return (
          <div
            key={key}
            className="bg-white border border-black/[0.07] rounded-xl px-4 pt-4 pb-3.5 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 cursor-default relative overflow-hidden"
          >
            <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wide mb-2">
              {label}
            </div>
            <div className={`font-serif text-[27px] font-bold tracking-tight leading-none mb-1 transition-all duration-300 ${styles.val}`}>
              {metric.value}
            </div>
            <div className={`text-[10.5px] font-mono transition-all duration-300 ${
              metric.dir === "up" ? "text-brand-green" : "text-brand-red"
            }`}>
              {metric.delta}
            </div>
            {/* Bottom accent bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-b-xl ${styles.bar}`} />
          </div>
        );
      })}
    </div>
  );
}
