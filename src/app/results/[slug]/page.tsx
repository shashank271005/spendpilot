/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EmailCapture } from '@/components/email-capture';
import { ShareButtons } from '@/components/share-buttons';
import { SavingsHero } from '@/components/results/savings-hero';
import { ExecutiveSummary } from '@/components/results/executive-summary';
import { ActionPlan } from '@/components/results/action-plan';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let savings = 5400;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data } = await supabase
        .from('audits')
        .select('annual_savings')
        .eq('slug', slug)
        .single();
      if (data) savings = data.annual_savings;
    } catch (err) {
      // ignore errors for metadata
    }
  }

  return {
    title: `Audit Results - SpendPilot`,
    openGraph: {
      title: `AI Spend Audit Results`,
      description: `View the AI tooling optimization report on SpendPilot.`,
      url: `https://spendpilot.com/results/${slug}`,
      images: [
        {
          url: `/api/og?savings=${savings}`,
          width: 1200,
          height: 630,
          alt: `SpendPilot potential annual savings report`,
        }
      ]
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
      <div className="noise-overlay" />
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
        <SavingsHero 
          annualSavings={audit.annual_savings}
          monthlySavings={audit.monthly_savings}
          currentSpend={audit.total_current_spend}
        />

        <ExecutiveSummary 
          summaryText={audit.ai_summary}
          hasHighSavings={hasHighSavings}
          hasNoSavings={hasNoSavings && audit.annual_savings === 0}
        />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Action Plan</h2>
            
            <ActionPlan auditTools={audit.audit_tools} />
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
