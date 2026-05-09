import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  // Await the params object before accessing properties
  const { slug } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Return mock data for development if Supabase isn't configured
    return NextResponse.json({
      id: 'mock-id',
      slug,
      team_size: 5,
      primary_use_case: 'coding',
      total_current_spend: 1200,
      total_projected_spend: 900,
      monthly_savings: 300,
      annual_savings: 3600,
      ai_summary: 'Your AI stack appears to have some overlaps. By consolidating coding tools, you can save $3,600 annually.',
      created_at: new Date().toISOString(),
      audit_tools: [
        { tool_name: 'cursor', plan: 'Pro', monthly_spend: 200, seats: 10, recommendation_type: 'Overlapping AI Coding Tools', recommendation_text: 'Consolidate to a single coding copilot.', savings: 200, confidence: 'High' }
      ]
    });
  }

  try {
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*, audit_tools(*)')
      .eq('slug', slug)
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Fetch Audit Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
