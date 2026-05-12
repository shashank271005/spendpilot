import Link from 'next/link';
import { ArrowLeft, Zap, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResultsNotFound() {
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
