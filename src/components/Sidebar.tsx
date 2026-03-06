"use client";

import type { RetailerId, RetailerData } from "@/types/topsort";

interface SidebarProps {
  retailers:   Record<RetailerId, RetailerData>;
  activeId:    RetailerId;
  onSelect:    (id: RetailerId) => void;
}

const NAV_ITEMS = [
  { label: "Overview",       icon: GridIcon,    active: true,  dotColor: "bg-brand-red"   },
  { label: "Auction Latency",icon: ChartIcon,   active: false, dotColor: null             },
  { label: "Fill Rate",      icon: ClockIcon,   active: false, dotColor: "bg-brand-amber" },
  { label: "Event Pipeline", icon: PulseIcon,   active: false, dotColor: null             },
  { label: "API Status",     icon: ServerIcon,  active: false, dotColor: null             },
  { label: "Campaigns",      icon: FolderIcon,  active: false, dotColor: null             },
];

export function Sidebar({ retailers, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="bg-ink flex flex-col sticky top-0 h-screen animate-fade-right">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.07]">
        <div className="w-7 h-7 bg-ts rounded-lg flex items-center justify-center font-mono text-[11px] font-medium text-white flex-shrink-0">
          TS
        </div>
        <div>
          <div className="font-semibold text-[14px] text-white tracking-tight">Topsort</div>
          <div className="text-[10px] font-mono text-white/30 mt-0.5">Integration Console</div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-3 pt-4">
        <div className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest px-1.5 mb-1.5">
          Monitoring
        </div>
        {NAV_ITEMS.slice(0, 4).map(({ label, icon: Icon, active, dotColor }) => (
          <NavItem key={label} label={label} Icon={Icon} active={active} dotColor={dotColor} />
        ))}
        <div className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest px-1.5 mb-1.5 mt-4">
          Management
        </div>
        {NAV_ITEMS.slice(4).map(({ label, icon: Icon, active }) => (
          <NavItem key={label} label={label} Icon={Icon} active={active} dotColor={null} />
        ))}
      </div>

      {/* Retailer Switcher */}
      <div className="mt-auto px-3 pt-4 pb-2 border-t border-white/[0.07]">
        <div className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest px-1.5 mb-2">
          Active Retailer
        </div>
        <div className="flex flex-col gap-0.5">
          {(Object.entries(retailers) as [RetailerId, RetailerData][]).map(([id, r]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`
                flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left w-full
                border-none cursor-pointer font-sans text-[12px] transition-colors duration-150
                ${activeId === id
                  ? "bg-ts/[0.12] text-ts-mid"
                  : "bg-transparent text-white/45 hover:bg-white/[0.06] hover:text-white/75"
                }
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeId === id ? "bg-ts" : "bg-white/20"}`} />
              <span className="flex-1">{r.name}</span>
              <span className={`text-[9px] font-mono flex-shrink-0 ${activeId === id ? "text-ts/50" : "text-white/20"}`}>
                {r.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live status */}
      <div className="flex items-center gap-2 px-5 py-3 font-mono text-[10.5px] text-white/25">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-green" />
        api.topsort.com — live
      </div>
    </aside>
  );
}

function NavItem({ label, Icon, active, dotColor }: {
  label: string;
  Icon: React.FC<{ className?: string }>;
  active: boolean;
  dotColor: string | null;
}) {
  return (
    <div className={`
      flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 cursor-pointer text-[13px] transition-colors
      ${active ? "bg-ts/[0.15] text-ts-mid" : "text-white/45 hover:bg-white/[0.06] hover:text-white/80"}
    `}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-65" />
      {label}
      {dotColor && (
        <div className={`w-1.5 h-1.5 rounded-full ml-auto ${dotColor}`} />
      )}
    </div>
  );
}

/* ── Icons ── */
function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="1,11 5,7 8,9 11,5 15,8" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" />
    </svg>
  );
}
function PulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h3l2-5 3 10 2-5h2" />
    </svg>
  );
}
function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2" width="14" height="5" rx="1.5" /><rect x="1" y="9" width="14" height="5" rx="1.5" />
    </svg>
  );
}
function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="12" height="9" rx="1.5" /><path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
    </svg>
  );
}
