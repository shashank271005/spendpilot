import { AnimatedCounter } from '@/components/animated-counter';

interface SavingsHeroProps {
  annualSavings: number;
  monthlySavings: number;
  currentSpend: number;
}

export function SavingsHero({ annualSavings, monthlySavings, currentSpend }: SavingsHeroProps) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 text-center border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full mix-blend-screen" />
      
      <h1 className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">Potential Annual Savings</h1>
      <div className="text-6xl md:text-8xl font-bold tracking-tight text-gradient mb-8">
        $<AnimatedCounter value={annualSavings} />
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Current Monthly</span>
          <span className="text-2xl font-semibold">${currentSpend.toLocaleString()}</span>
        </div>
        <div className="h-12 w-px bg-border hidden md:block" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Monthly Savings</span>
          <span className="text-2xl font-semibold text-green-400">
            +${monthlySavings.toLocaleString()}
          </span>
        </div>
        <div className="h-12 w-px bg-border hidden md:block" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Optimized Spend</span>
          <span className="text-2xl font-semibold">${(currentSpend - monthlySavings).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
