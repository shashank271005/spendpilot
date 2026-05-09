import { describe, it, expect } from 'vitest';
import { runAudit, AuditInput } from '../lib/audit-engine';

describe('Audit Engine', () => {
  it('should consolidate overlapping coding tools and recommend standardizing on the most expensive one', () => {
    const input: AuditInput = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'github_copilot', plan: 'Business', monthlySpend: 190, seats: 10 },
        { toolId: 'cursor', plan: 'Pro', monthlySpend: 200, seats: 10 },
      ],
    };

    const result = runAudit(input);

    expect(result.currentSpend).toBe(390);
    expect(result.monthlySavings).toBe(190); // Savings from Github Copilot
    expect(result.projectedSpend).toBe(200); // Spend on Cursor
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].issue).toContain('Sub-optimal License Utilization');
    expect(result.recommendations[0].tool).toBe('GitHub Copilot'); // Redundant tool
  });

  it('should recommend downgrading enterprise plans for small teams', () => {
    const input: AuditInput = {
      teamSize: 2, // Small team
      primaryUseCase: 'mixed',
      tools: [
        { toolId: 'chatgpt', plan: 'Enterprise', monthlySpend: 120, seats: 2 }, // Assume Pro is 20/seat, so 40 total
      ],
    };

    const result = runAudit(input);

    expect(result.currentSpend).toBe(120);
    // ChatGPT Pro is $20/user. Expected pro cost = 40. Savings = 120 - 40 = 80
    expect(result.monthlySavings).toBe(80);
    expect(result.projectedSpend).toBe(40);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].issue).toContain('Inefficient Tier Allocation');
  });

  it('should flag high API spend and suggest Credex partnership', () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: 'data',
      tools: [
        { toolId: 'anthropic_api', plan: 'Pay-as-you-go', monthlySpend: 600, seats: 1 },
      ],
    };

    const result = runAudit(input);

    expect(result.currentSpend).toBe(600);
    // 20% of 600 = 120
    expect(result.monthlySavings).toBe(120);
    expect(result.projectedSpend).toBe(480);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].tool).toBe('API Infrastructure');
    expect(result.recommendations[0].issue).toContain('Infrastructure Spend Optimization');
  });

  it('should return no recommendations if stack is completely optimized', () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: 'writing',
      tools: [
        { toolId: 'chatgpt', plan: 'Pro', monthlySpend: 100, seats: 5 }, // 20 * 5 = 100
      ],
    };

    const result = runAudit(input);

    expect(result.currentSpend).toBe(100);
    expect(result.monthlySavings).toBe(0);
    expect(result.projectedSpend).toBe(100);
    expect(result.recommendations).toHaveLength(0);
  });
});
