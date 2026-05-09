import Anthropic from '@anthropic-ai/sdk';
import { AuditResult } from './audit-engine';

export async function generateAiSummary(auditResult: AuditResult, useCase: string, teamSize: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  const fallbackSummary = `Based on your team size of ${teamSize} and primary use case (${useCase}), we identified $${auditResult.monthlySavings.toLocaleString(undefined, {minimumFractionDigits: 2})} in potential monthly savings. ${
    auditResult.recommendations.length > 0 
      ? 'By consolidating overlapping tools and optimizing plan tiers, you can significantly reduce your SaaS bloat.' 
      : 'Your AI stack appears to be well-optimized for your current scale.'
  }`;

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY is missing. Using deterministic fallback summary.');
    return fallbackSummary;
  }

  try {
    const anthropic = new Anthropic({
      apiKey,
    });

    const prompt = `You are a strategic infrastructure advisor and fractional CFO for startups. 
Analyze the following AI tooling audit for a startup with a team size of ${teamSize} and a primary use case of "${useCase}".

Audit Results:
- Current Spend: $${auditResult.currentSpend}
- Potential Monthly Savings: $${auditResult.monthlySavings}
- Identified Inefficiencies/Recommendations: ${auditResult.recommendations.map(r => r.issue).join(', ') || 'None identified'}

Write a personalized, ~100-word executive summary of this audit. 
Tone: Professional, financially credible, polished SaaS feeling. 
Highlight the biggest inefficiencies (if any) and the value of optimizing their stack. If there are no savings, praise their efficiency. Do not include introductory/outro fluff like "Here is your summary". Just provide the text.`;

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 250,
      temperature: 0.7,
      system: "You are an expert SaaS optimization consultant.",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        }
      ]
    });

    // Extracting text from response
    if (msg.content && msg.content.length > 0 && msg.content[0].type === 'text') {
      return msg.content[0].text;
    }

    return fallbackSummary;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return fallbackSummary; // Graceful fallback
  }
}
