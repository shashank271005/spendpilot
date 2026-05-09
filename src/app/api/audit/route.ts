import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { runAudit, AuditInput } from '@/lib/audit-engine';
import { generateAiSummary } from '@/lib/anthropic';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const input: AuditInput = await req.json();

    // Run deterministic audit engine
    const auditResult = runAudit(input);

    // Generate AI Summary
    const aiSummary = await generateAiSummary(auditResult, input.primaryUseCase, input.teamSize);

    // Generate unique share slug
    const slug = randomBytes(12).toString('hex');

    // Save to Supabase (assuming supabase is configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data: auditRecord, error: auditError } = await supabase
        .from('audits')
        .insert({
          slug,
          team_size: input.teamSize,
          primary_use_case: input.primaryUseCase,
          total_current_spend: auditResult.currentSpend,
          total_projected_spend: auditResult.projectedSpend,
          monthly_savings: auditResult.monthlySavings,
          annual_savings: auditResult.annualSavings,
          ai_summary: aiSummary,
        })
        .select()
        .single();

      if (auditError) {
        console.error('Error saving audit:', auditError);
        return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
      }

      // Save tools
      const toolInserts = input.tools.map(t => {
        // Find recommendation for this tool if it exists to attach savings/confidence
        const toolRec = auditResult.recommendations.find(r => r.tool.toLowerCase().includes(t.toolId.replace('_', ' ')));
        return {
          audit_id: auditRecord.id,
          tool_name: t.toolId,
          plan: t.plan,
          monthly_spend: t.monthlySpend,
          seats: t.seats,
          recommendation_type: toolRec ? toolRec.issue : null,
          recommendation_text: toolRec ? toolRec.recommendation : null,
          savings: toolRec ? toolRec.savings : 0,
          confidence: toolRec ? toolRec.confidence : null,
        };
      });

      const { error: toolsError } = await supabase
        .from('audit_tools')
        .insert(toolInserts);

      if (toolsError) {
        console.error('Error saving tools:', toolsError);
      }
    }

    return NextResponse.json({ 
      slug,
      result: auditResult,
      aiSummary
    });
  } catch (error) {
    console.error('Audit API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
