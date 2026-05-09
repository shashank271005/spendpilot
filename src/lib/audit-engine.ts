import { PRICING_DATA, ToolCategory } from './pricing-data';

export interface UserTool {
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'research' | 'data' | 'mixed';
  tools: UserTool[];
}

export interface Recommendation {
  tool: string;
  issue: string;
  recommendation: string;
  savings: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface AuditResult {
  currentSpend: number;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: Recommendation[];
}

export function runAudit(input: AuditInput): AuditResult {
  let currentSpend = 0;
  let projectedSpend = 0;
  const recommendations: Recommendation[] = [];

  const toolsByCategory: Record<ToolCategory, UserTool[]> = {
    coding: [],
    chat: [],
    api: [],
    other: [],
  };

  // 1. Categorize tools and calculate current spend
  for (const userTool of input.tools) {
    currentSpend += userTool.monthlySpend;
    const toolData = PRICING_DATA[userTool.toolId];
    if (toolData) {
      toolsByCategory[toolData.category].push(userTool);
    }
  }

  projectedSpend = currentSpend; // will subtract savings

  // 2. Check for Overlapping Tools (Consolidation)
  // Coding Copilots
  if (toolsByCategory.coding.length > 1) {

    // Keep the one with the highest spend or just recommend keeping the primary one (say, Cursor)
    const sortedCoding = [...toolsByCategory.coding].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const primary = sortedCoding[0];
    const redundant = sortedCoding.slice(1);

    for (const r of redundant) {
      const toolData = PRICING_DATA[r.toolId];
      recommendations.push({
        tool: toolData.name,
        issue: 'Sub-optimal License Utilization: Redundant Coding Copilots',
        recommendation: `Standardize engineering organization on ${PRICING_DATA[primary.toolId].name}.`,
        savings: r.monthlySpend,
        confidence: 'High',
        reasoning: `Analysis indicates overlapping functional capabilities across multiple active coding assistants. Standardizing on a single enterprise-wide solution (${PRICING_DATA[primary.toolId].name}) eliminates redundant licensing overhead while maintaining developer velocity and codebase consistency.`,
      });
      projectedSpend -= r.monthlySpend;
    }
  }

  // Chat Assistants
  if (toolsByCategory.chat.length > 1) {
    const sortedChat = [...toolsByCategory.chat].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const primary = sortedChat[0];
    const redundant = sortedChat.slice(1);

    for (const r of redundant) {
      const toolData = PRICING_DATA[r.toolId];
      recommendations.push({
        tool: toolData.name,
        issue: 'SaaS Fragmentation: Overlapping Conversational AI',
        recommendation: `Consolidate chat interfaces to ${PRICING_DATA[primary.toolId].name}.`,
        savings: r.monthlySpend,
        confidence: 'High',
        reasoning: `Your organization is currently distributing spend across multiple chat-based AI platforms that leverage commoditized frontier models. Consolidating to a unified platform centralizes data governance and recovers fragmented SaaS expenditure.`,
      });
      projectedSpend -= r.monthlySpend;
    }
  }

  // 3. Check for Downgrade Opportunities
  for (const userTool of input.tools) {
    const toolData = PRICING_DATA[userTool.toolId];
    if (!toolData) continue;

    const isConsolidated = recommendations.some(r => r.tool === toolData.name && r.issue.startsWith('Overlapping'));
    if (isConsolidated) continue; // Already handled by consolidation

    // If small team using Team/Business/Enterprise plans
    if (input.teamSize <= 3 && (userTool.plan.toLowerCase().includes('team') || userTool.plan.toLowerCase().includes('business') || userTool.plan.toLowerCase().includes('enterprise'))) {
      const proPlan = toolData.plans.find(p => p.name.toLowerCase().includes('pro') || p.name.toLowerCase().includes('individual') || p.name.toLowerCase().includes('plus'));
      
      if (proPlan) {
        // Evaluate if they are overpaying vs standard pro plan
        const expectedProCost = proPlan.pricePerSeat * userTool.seats;
        if (userTool.monthlySpend > expectedProCost) {
          const savings = userTool.monthlySpend - expectedProCost;
          recommendations.push({
            tool: toolData.name,
            issue: 'Inefficient Tier Allocation: Unutilized Enterprise Features',
            recommendation: `Right-size licensing to the ${proPlan.name} tier.`,
            savings: savings,
            confidence: 'Medium',
            reasoning: `Given your current headcount (${input.teamSize} seats), the compliance and administrative features bundled in the ${userTool.plan} tier are likely yielding negative ROI. Transitioning to the ${proPlan.name} tier preserves core AI model access while optimizing per-seat capital efficiency.`,
          });
          projectedSpend -= savings;
        }
      }
    }
  }

  // 4. API Spend Analysis
  const totalApiSpend = toolsByCategory.api.reduce((acc, t) => acc + t.monthlySpend, 0);
  if (totalApiSpend > 500) {
    // Add a recommendation to seek credits
    recommendations.push({
      tool: 'API Infrastructure',
      issue: 'Infrastructure Spend Optimization',
      recommendation: 'Engage Credex to secure startup infrastructure credits.',
      savings: totalApiSpend * 0.2, // Estimate 20% savings via credits
      confidence: 'Medium',
      reasoning: `API consumption run-rate indicates significant margin pressure. Companies at this volume threshold are highly eligible for partner-subsidized committed use discounts. Engaging a credit broker can immediately reduce variable infrastructure OPEX by up to 20%.`,
    });
    projectedSpend -= (totalApiSpend * 0.2);
  }

  // Recalculate savings to ensure no precision errors
  const monthlySavings = currentSpend - projectedSpend;
  const annualSavings = monthlySavings * 12;

  return {
    currentSpend,
    projectedSpend,
    monthlySavings,
    annualSavings,
    recommendations,
  };
}
