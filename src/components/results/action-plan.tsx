/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShieldAlert, Info } from 'lucide-react';

interface ActionPlanProps {
  auditTools: any[];
}

export function ActionPlan({ auditTools }: ActionPlanProps) {
  const recommendations = auditTools.filter((t: any) => t.recommendation_type);

  if (recommendations.length === 0) {
    return <p className="text-muted-foreground italic">No actions required.</p>;
  }

  return (
    <>
      {recommendations.map((tool: any, idx: number) => (
        <div key={idx} className="glass rounded-xl p-5 border border-border/50 hover:border-border transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-destructive/10 text-destructive">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-semibold">{tool.recommendation_type}</h4>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-400">+${tool.savings}/mo</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{tool.confidence} Conf.</div>
            </div>
          </div>
          <p className="text-sm text-foreground/90 mb-3">{tool.recommendation_text}</p>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" /> Tool: {tool.tool_name.replace('_', ' ')} ({tool.plan}) - ${tool.monthly_spend}/mo
          </div>
        </div>
      ))}
    </>
  );
}
