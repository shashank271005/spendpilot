import Link from 'next/link';
import { ArrowRight, CheckCircle2, BarChart3, Zap, Shield } from 'lucide-react';
import * as motion from 'framer-motion/client';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background selection:bg-primary/30">
      {/* Background gradients & grid */}
      <div className="noise-overlay" />
      <div className="absolute inset-0 bg-grid-pattern -z-20 opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-radial from-primary/15 to-transparent -z-10 blur-3xl opacity-60" />
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-gradient-radial from-slate-400/10 to-transparent -z-10 blur-3xl rounded-full mix-blend-screen" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-gradient-radial from-purple-500/10 to-transparent -z-10 blur-3xl rounded-full mix-blend-screen" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 border border-white/10">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white/90">SpendPilot</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-white hover:bg-white/5">Sign In</Button>
          <Button asChild className="rounded-full px-6 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all">
            <Link href="/audit">
              Run Free Audit
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 flex flex-col justify-center items-center text-center min-h-[calc(100vh-76px)]">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both relative group mb-8 mt-[-10vh]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-slate-400/20 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 border border-white/5 backdrop-blur-md text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Over $2M in AI spend optimized this month</span>
            </div>
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both text-5xl md:text-6xl lg:text-[4.5rem] font-semibold tracking-tight mb-8 max-w-4xl text-gradient pb-2 leading-tight">
            Your AI Stack Is Probably <br className="hidden md:block" /> Leaking Money
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
            Audit your AI tooling spend in 60 seconds and uncover unnecessary costs, redundant subscriptions, and optimization opportunities.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
              <Button asChild size="lg" className="relative w-full sm:w-auto rounded-full text-base h-12 px-8 bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-shadow">
                <Link href="/audit">
                  Run Free Audit
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0 font-medium">No credit card required. 100% free.</p>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full border-y border-white/5 bg-white/[0.02] py-12 backdrop-blur-sm relative">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <p className="text-xs font-semibold text-muted-foreground mb-8 uppercase tracking-[0.2em]">Trusted by engineering teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Massive Dynamic'].map(logo => (
                <div key={logo} className="text-2xl font-bold font-mono tracking-tighter text-white/80">{logo}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 view-in">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">Everything you need to optimize AI spend</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Our deterministic engine analyzes your exact stack and usage patterns to find savings that general budgeting tools miss.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'AI Spend Analysis', icon: BarChart3, desc: 'Instantly see your true monthly and annual costs across all APIs, copilots, and chat tools.' },
              { title: 'Deterministic Logic', icon: Shield, desc: 'No hallucinated savings. We use hardcoded pricing models and strict consolidation rules.' },
              { title: 'Actionable Insights', icon: Zap, desc: 'Get step-by-step recommendations on downgrades, overlapping tools, and credit opportunities.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-10 rounded-3xl flex flex-col items-start group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white/90">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Preview Card */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20">
          <div className="glass-card rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-1000" />
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 uppercase tracking-wider">
                Simulation Engine
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-gradient">Stop paying for overlapping subscriptions</h2>
              <ul className="space-y-5 mb-10">
                {[
                  'Consolidate multiple coding copilots',
                  'Downgrade unused enterprise seats',
                  'Secure startup infrastructure credits'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-white/80">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="secondary" className="rounded-full h-12 px-8 bg-white/10 hover:bg-white/20 border border-white/5 text-white backdrop-blur-md">
                <Link href="/audit">Try it yourself</Link>
              </Button>
            </div>
            <div className="flex-1 w-full z-10">
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="bg-white/5 px-4 py-4 border-b border-white/10 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Potential Annual Savings</div>
                    <div className="text-xs font-semibold bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full">High Confidence</div>
                  </div>
                  <div className="text-5xl font-bold text-white mb-8 tracking-tight">$4,280</div>
                  <div className="space-y-4">
                    <div className="h-14 rounded-xl bg-white/5 border border-white/10 flex items-center px-5 justify-between hover:bg-white/10 transition-colors">
                      <span className="text-base text-white/90">Multiple Chat Assistants</span>
                      <span className="text-base font-semibold text-red-400">-$720/yr</span>
                    </div>
                    <div className="h-14 rounded-xl bg-white/5 border border-white/10 flex items-center px-5 justify-between hover:bg-white/10 transition-colors">
                      <span className="text-base text-white/90">Unused Team Seats</span>
                      <span className="text-base font-semibold text-red-400">-$3,560/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about SpendPilot.</p>
          </div>
          <div className="grid gap-6">
            {[
              { q: 'Is SpendPilot actually free?', a: 'Yes. The initial audit is 100% free. We may refer you to partners like Credex for infrastructure credits, which helps keep this tool free.' },
              { q: 'Do you use AI to calculate savings?', a: 'No. The savings calculations are entirely deterministic, based on hardcoded pricing data and strict logic rules. We only use AI to generate a personalized executive summary of the results.' },
              { q: 'What tools do you support?', a: 'We currently support major coding copilots (Cursor, GitHub Copilot, Windsurf), chat assistants (ChatGPT, Claude, Gemini), and APIs (OpenAI, Anthropic).' }
            ].map((faq, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl group hover:border-primary/30 transition-colors">
                <h4 className="font-semibold text-xl mb-3 text-white/90 group-hover:text-primary transition-colors">{faq.q}</h4>
                <p className="text-muted-foreground leading-relaxed text-lg">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-6 bg-black/20 backdrop-blur-lg relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-white/90">SpendPilot</span>
          </div>
          <p className="text-sm text-muted-foreground text-center font-medium">
            © {new Date().getFullYear()} SpendPilot. All rights reserved. Not affiliated with the AI tools mentioned.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">GitHub</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-slate-400 rounded-full blur opacity-40"></div>
        <Button asChild size="lg" className="relative w-full rounded-full shadow-2xl h-14 text-base bg-white text-black">
          <Link href="/audit">Run Free Audit</Link>
        </Button>
      </div>
    </div>
  );
}
