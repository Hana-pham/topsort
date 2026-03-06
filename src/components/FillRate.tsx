"use client";

import type { CategoryFill, SlaBadge } from "@/types/topsort";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface FillRateProps {
  categories: CategoryFill[];
  fillBadge:  SlaBadge;
}

export function FillRate({ categories, fillBadge }: FillRateProps) {
  return (
    <Panel>
      <PanelHeader
        title="Fill Rate by Category"
        subtitle="Empty slots represent lost ad revenue"
        badge={<Badge cls={fillBadge.cls} label={fillBadge.label} />}
      />
      <div className="flex flex-col">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.07] last:border-0 hover:bg-cream transition-colors cursor-default"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: cat.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium truncate">{cat.name}</div>
              <div
                className="text-[10px] font-mono mt-0.5 transition-colors duration-300"
                style={{ color: cat.warn ? "#C0392B" : undefined }}
              >
                {!cat.warn && <span className="text-ink-muted">{cat.sub}</span>}
                {cat.warn  && cat.sub}
              </div>
            </div>
            <div className="w-22 flex-shrink-0">
              <div className="h-1 bg-cream-3 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${cat.pct}%`, background: cat.color }}
                />
              </div>
              <div
                className="text-[10.5px] font-mono font-medium text-right transition-all duration-300"
                style={{ color: cat.color }}
              >
                {cat.pct}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
