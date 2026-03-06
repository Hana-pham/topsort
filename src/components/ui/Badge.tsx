import type { Severity } from "@/types/topsort";

interface BadgeProps {
  cls: Severity;
  label: string;
}

const styles: Record<Severity, string> = {
  green: "bg-green-50 text-brand-green border-green-200",
  amber: "bg-amber-50 text-brand-amber border-amber-200",
  red:   "bg-red-50 text-brand-red border-red-200",
  blue:  "bg-blue-50 text-brand-blue border-blue-200",
};

export function Badge({ cls, label }: BadgeProps) {
  return (
    <span className={`
      inline-block text-[9.5px] font-mono px-1.5 py-0.5
      rounded border whitespace-nowrap transition-all duration-300
      ${styles[cls]}
    `}>
      {label}
    </span>
  );
}
