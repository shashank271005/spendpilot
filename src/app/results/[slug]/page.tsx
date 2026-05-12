/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Loader2, SearchX } from 'lucide-react';
import { EmailCapture } from '@/components/email-capture';
import { ShareButtons } from '@/components/share-buttons';
import { SavingsHero } from '@/components/results/savings-hero';
import { ExecutiveSummary } from '@/components/results/executive-summary';
import { ActionPlan } from '@/components/results/action-plan';
import { Button } from '@/components/ui/button';

export default function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 1. Try localStorage first (works on same device after audit)
    const saved = localStorage.getItem(`spendpilot_result_${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAudit(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse cached audit', e);
      }
    }

    // 2. Fallback: try API (which queries Supabase or returns mock data)
    fetch(`/api/audit/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data.error) {
          setNotFound(true);
        } else {
          setAudit(data);
          // Cache for future visits
          localStorage.setItem(`spendpilot_result_${slug}`, JSON.stringify(data));
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  if (notFound || !audit) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="noise-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-primary/10 to-transparent -z-10 blur-3xl" />

        <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">SpendPilot</span>
          </div>
          <div className="w-16" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-8 border border-white/10">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Audit Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            This audit report doesn&apos;t exist or may have expired. Run a new audit to get fresh results.
          </p>
          <Button asChild className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90">
            <Link href="/audit">Run a New Audit</Link>
          </Button>
        </main>
      </div>
    );
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
