import type { Alert, Severity } from "@/types/topsort";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface AlertsListProps {
  alerts:     Alert[];
  alertCount: number;
}

const barColor: Record<Severity, string> = {
  red:   "bg-brand-red",
  amber: "bg-[#E07B00]",
  blue:  "bg-brand-blue",
  green: "bg-brand-green",
};

export function AlertsList({ alerts, alertCount }: AlertsListProps) {
  const badgeCls: Severity = alertCount >= 4 ? "red" : alertCount >= 2 ? "amber" : "blue";

  return (
    <Panel>
      <PanelHeader
        title="Active Alerts"
        subtitle="Requires immediate attention"
        badge={<Badge cls={badgeCls} label={`${alertCount} OPEN`} />}
      />
      <div className="flex flex-col">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex gap-2.5 px-4 py-3 border-b border-black/[0.07] last:border-0 hover:bg-cream transition-colors cursor-default"
          >
            <div className={`w-[3px] rounded-sm flex-shrink-0 self-stretch min-h-[34px] ${barColor[alert.sev]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-medium mb-0.5 leading-snug">{alert.title}</div>
              <div className="text-[10px] font-mono text-ink-muted leading-snug">{alert.meta}</div>
            </div>
            <div className="text-[10px] font-mono text-ink-faint flex-shrink-0 mt-0.5">{alert.time}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
