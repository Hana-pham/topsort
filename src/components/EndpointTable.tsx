import type { EndpointStatus, Severity } from "@/types/topsort";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface EndpointTableProps {
  endpoints: EndpointStatus[];
}

export function EndpointTable({ endpoints }: EndpointTableProps) {
  const allOk = endpoints.every((e) => e.uptimeCls === "green");

  return (
    <Panel>
      <PanelHeader
        title="API Endpoint Status"
        subtitle="api.topsort.com/v2 · uptime last 90 days"
        badge={<Badge cls={allOk ? "green" : "amber"} label={allOk ? "ALL OPERATIONAL" : "DEGRADED"} />}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-cream">
            <th className="text-left px-4 py-2 text-[9px] font-mono text-ink-muted uppercase tracking-wide border-b border-black/[0.07] font-normal">Endpoint</th>
            <th className="text-left px-4 py-2 text-[9px] font-mono text-ink-muted uppercase tracking-wide border-b border-black/[0.07] font-normal">Latency</th>
            <th className="text-left px-4 py-2 text-[9px] font-mono text-ink-muted uppercase tracking-wide border-b border-black/[0.07] font-normal">90-Day Uptime</th>
            <th className="text-left px-4 py-2 text-[9px] font-mono text-ink-muted uppercase tracking-wide border-b border-black/[0.07] font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((ep) => (
            <tr key={ep.path} className="hover:bg-cream transition-colors group">
              <td className="px-4 py-2.5 border-b border-black/[0.07] last:border-0">
                <span className={`
                  inline-block text-[9px] font-mono px-1 py-0.5 rounded border mr-1.5
                  ${ep.method === "POST"
                    ? "bg-ts-pale text-ts border-ts/20"
                    : "bg-blue-50 text-brand-blue border-blue-200"
                  }
                `}>
                  {ep.method}
                </span>
                <span className="font-mono text-[11px] text-brand-blue">{ep.path}</span>
              </td>
              <td className="px-4 py-2.5 border-b border-black/[0.07]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ep.latColor }} />
                  <span className="font-mono text-[11px] font-medium" style={{ color: ep.latColor }}>
                    {ep.latency}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5 border-b border-black/[0.07]">
                <UptimeBar segs={ep.segs} />
              </td>
              <td className="px-4 py-2.5 border-b border-black/[0.07]">
                <Badge cls={ep.uptimeCls} label={ep.uptime} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function UptimeBar({ segs }: { segs: Array<0 | 1 | 2> }) {
  return (
    <div className="flex gap-0.5">
      {segs.map((s, i) => (
        <div
          key={i}
          className={`w-1 h-3 rounded-sm ${
            s === 0 ? "bg-brand-green opacity-60"
            : s === 1 ? "bg-brand-red opacity-85"
            : "bg-brand-amber opacity-75"
          }`}
        />
      ))}
    </div>
  );
}
