import { Zap, ArrowDownToLine, Check } from 'lucide-react';

interface ExecutiveSummaryProps {
  summaryText: string;
  hasHighSavings: boolean;
  hasNoSavings: boolean;
}

export function ExecutiveSummary({ summaryText, hasHighSavings, hasNoSavings }: ExecutiveSummaryProps) {
  return (
    <>
      <div className="glass p-6 md:p-8 rounded-2xl mb-12 border border-primary/20 relative">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Executive Summary</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {summaryText}
        </p>
      </div>

      {hasHighSavings && (
        <div className="bg-primary/10 border border-primary/30 p-6 rounded-2xl mb-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Credex Infrastructure Partnership</h3>
            <p className="text-sm text-muted-foreground">Your high API/tooling spend qualifies you for startup infrastructure credits. Talk to our partners at Credex to secure discounted AI credits.</p>
          </div>
          <div className="shrink-0">
            <a href="#" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Claim Credits
            </a>
          </div>
        </div>
      )}

      {hasNoSavings && (
        <div className="glass p-6 rounded-2xl mb-12 flex items-center gap-4 border-green-500/20">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold">Your stack is optimized!</h3>
            <p className="text-sm text-muted-foreground">We didn&apos;t find any major overlapping subscriptions or unnecessary enterprise plans based on your team size.</p>
          </div>
        </div>
      )}
    </>
  );
}
