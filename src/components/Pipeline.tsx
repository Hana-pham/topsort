import type { PipelineHealth } from "@/types/topsort";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface PipelineProps {
  pipeline: PipelineHealth;
}

export function Pipeline({ pipeline }: PipelineProps) {
  const badge = pipeline.hasIssue
    ? <Badge cls="red"   label="DROP DETECTED" />
    : <Badge cls="green" label="HEALTHY" />;

  return (
    <Panel>
      <PanelHeader
        title="Event Pipeline Health"
        subtitle="/v2/events · impression to purchase flow"
        badge={badge}
      />

      {/* Steps */}
      <div className="flex items-center px-4 py-5 gap-0">
        {pipeline.steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Icon */}
              <div className={`
                w-9 h-9 rounded-[9px] flex items-center justify-center mb-1.5 border
                ${step.ok
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                }
              `}>
                {step.ok ? <OkIcon /> : <FailIcon />}
              </div>
              <div className="text-[10px] font-medium text-ink-mid text-center mb-0.5">
                {step.label}
              </div>
              <div className={`text-[9.5px] font-mono text-center transition-all duration-300 ${
                step.ok ? "text-brand-green" : "text-brand-red font-medium"
              }`}>
                {step.count}
              </div>
            </div>

            {/* Connector arrow */}
            {i < pipeline.steps.length - 1 && (
              <div className={`
                flex-shrink-0 w-5 h-px relative -mt-8
                ${!pipeline.steps[i + 1].ok && pipeline.hasIssue
                  ? "bg-brand-red/40"
                  : "bg-black/10"
                }
              `}>
                <div className={`
                  absolute -right-[3px] -top-[3px] w-1.5 h-1.5 border-t border-r rotate-45
                  ${!pipeline.steps[i + 1].ok && pipeline.hasIssue
                    ? "border-brand-red/40"
                    : "border-black/10"
                  }
                `} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      <div className={`
        mx-4 mb-4 rounded-lg px-3 py-2.5 text-[11px] text-ink-mid leading-relaxed transition-all duration-300
        ${pipeline.hasIssue
          ? "bg-red-50 border border-red-200"
          : "bg-green-50 border border-green-200"
        }
      `}>
        <strong className={`font-mono text-[9.5px] block mb-1 ${
          pipeline.hasIssue ? "text-brand-red" : "text-brand-green"
        }`}>
          {pipeline.hasIssue ? "WHY THIS MATTERS" : "ALL CLEAR"}
        </strong>
        {pipeline.note}
      </div>
    </Panel>
  );
}

function OkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1A7A52" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M5 8l2 2 4-4" />
    </svg>
  );
}

function FailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#C0392B" strokeWidth="1.5">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
