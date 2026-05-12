import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit Results - SpendPilot',
  description: 'View your AI tooling optimization report on SpendPilot.',
  openGraph: {
    title: 'AI Spend Audit Results',
    description: 'View the AI tooling optimization report on SpendPilot.',
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
