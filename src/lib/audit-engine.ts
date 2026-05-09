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
        issue: 'Overlapping AI Coding Tools',
        recommendation: `Consolidate to a single coding copilot (${PRICING_DATA[primary.toolId].name}).`,
        savings: r.monthlySpend,
        confidence: 'High',
        reasoning: `You are paying for multiple AI coding assistants. Standardizing on ${PRICING_DATA[primary.toolId].name} for your team eliminates redundant licensing costs without sacrificing developer velocity.`,
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
        issue: 'Overlapping Chat Assistants',
        recommendation: `Standardize on a single AI chat platform (${PRICING_DATA[primary.toolId].name}).`,
        savings: r.monthlySpend,
        confidence: 'High',
        reasoning: `Most premium AI chat tools provide access to comparable frontier models. Consolidating overlapping subscriptions to a single platform prevents fragmentation and duplicate spend.`,
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
            issue: 'Unnecessary Enterprise/Team Plan',
            recommendation: `Downgrade to ${proPlan.name} plan.`,
            savings: savings,
            confidence: 'Medium',
            reasoning: `For a team size of ${input.teamSize}, the administrative features of the ${userTool.plan} plan are likely underutilized. Downgrading to the ${proPlan.name} tier offers the same core AI capabilities at a reduced cost per seat.`,
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
      issue: 'High unoptimized API Spend',
      recommendation: 'Talk to Credex to secure discounted AI credits.',
      savings: totalApiSpend * 0.2, // Estimate 20% savings via credits
      confidence: 'Medium',
      reasoning: `Your monthly API spend exceeds $500. Startups at this volume can often secure significant infrastructure credits or committed use discounts through partners like Credex, potentially reducing variable costs by up to 20%.`,
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
