import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, ShieldAlert, ArrowDownToLine, Info, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AnimatedCounter } from '@/components/animated-counter';
import { EmailCapture } from '@/components/email-capture';
import { ShareButtons } from '@/components/share-buttons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Audit Results - SpendPilot`,
    openGraph: {
      title: `AI Spend Audit Results`,
      description: `View the AI tooling optimization report on SpendPilot.`,
      url: `https://spendpilot.com/results/${slug}`,
    }
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let audit: any = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from('audits')
      .select('*, audit_tools(*)')
      .eq('slug', slug)
      .single();
    audit = data;
  } else {
    // Mock data for local dev without Supabase
    audit = {
      id: 'mock-id',
      slug,
      team_size: 10,
      primary_use_case: 'coding',
      total_current_spend: 1500,
      monthly_savings: 450,
      annual_savings: 5400,
      ai_summary: "Your AI stack is slightly unoptimized. We found $450 in monthly savings by consolidating your coding copilots and downgrading unused enterprise seats. Acting on these recommendations will improve your capital efficiency without impacting developer velocity.",
      audit_tools: [
        { tool_name: 'cursor', plan: 'Pro', monthly_spend: 200, seats: 10, recommendation_type: 'Overlapping AI Coding Tools', recommendation_text: 'Consolidate to a single coding copilot.', savings: 200, confidence: 'High' },
        { tool_name: 'github_copilot', plan: 'Business', monthly_spend: 190, seats: 10, recommendation_type: null, recommendation_text: null, savings: 0, confidence: null },
      ]
    };
  }

  if (!audit) {
    notFound();
  }

  const hasHighSavings = audit.monthly_savings > 500;
  const hasNoSavings = audit.monthly_savings < 100;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden pb-20">
      {/* Dynamic Background gradient based on results */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial -z-10 blur-3xl opacity-30 ${hasNoSavings ? 'from-green-500/20' : 'from-primary/20'} to-transparent`} />
      
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">New Audit</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">SpendPilot</span>
        </div>
        <ShareButtons slug={slug} />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Top Hero: Savings */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 text-center border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full mix-blend-screen" />
          
          <h1 className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">Potential Annual Savings</h1>
          <div className="text-6xl md:text-8xl font-bold tracking-tight text-gradient mb-8">
            $<AnimatedCounter value={audit.annual_savings} />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Current Monthly</span>
              <span className="text-2xl font-semibold">${audit.total_current_spend.toLocaleString()}</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Monthly Savings</span>
              <span className="text-2xl font-semibold text-green-400">
                +${audit.monthly_savings.toLocaleString()}
              </span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Optimized Spend</span>
              <span className="text-2xl font-semibold">${(audit.total_current_spend - audit.monthly_savings).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="glass p-6 md:p-8 rounded-2xl mb-12 border border-primary/20 relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Executive Summary</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {audit.ai_summary}
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

        {hasNoSavings && audit.annual_savings === 0 && (
          <div className="glass p-6 rounded-2xl mb-12 flex items-center gap-4 border-green-500/20">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Your stack is optimized!</h3>
              <p className="text-sm text-muted-foreground">We didn't find any major overlapping subscriptions or unnecessary enterprise plans based on your team size.</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Action Plan</h2>
            
            {audit.audit_tools.filter((t: any) => t.recommendation_type).length === 0 ? (
              <p className="text-muted-foreground italic">No actions required.</p>
            ) : (
              audit.audit_tools.filter((t: any) => t.recommendation_type).map((tool: any, idx: number) => (
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
              ))
            )}
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24">
              <EmailCapture auditId={audit.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
