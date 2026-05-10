import { AuditForm } from '@/components/audit-form';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-primary/5 to-transparent -z-10 blur-3xl" />

      <header className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">SpendPilot</span>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Audit Your AI Stack</h1>
          <p className="text-muted-foreground">Add all the AI tools your team currently pays for. We&apos;ll analyze your stack for overlaps, inefficiencies, and better pricing tiers.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <AuditForm />
        </div>
      </main>
    </div>
  );
}
