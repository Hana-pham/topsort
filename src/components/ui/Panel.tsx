interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div className={`bg-white border border-black/[0.07] rounded-xl shadow-sm overflow-hidden transition-opacity duration-300 ${className}`}>
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title:    string;
  subtitle: string;
  badge?:   React.ReactNode;
}

export function PanelHeader({ title, subtitle, badge }: PanelHeaderProps) {
  return (
    <div className="flex items-start justify-between px-4 py-3.5 border-b border-black/[0.07]">
      <div>
        <div className="text-[13px] font-semibold tracking-tight">{title}</div>
        <div className="text-[10px] font-mono text-ink-muted mt-0.5">{subtitle}</div>
      </div>
      {badge && <div className="ml-3 mt-0.5 flex-shrink-0">{badge}</div>}
    </div>
  );
}
