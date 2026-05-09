import { describe, it, expect } from 'vitest';
import { runAudit, AuditInput } from '../lib/audit-engine';

describe('Audit Engine Deterministic Logic', () => {
  it('should calculate current spend correctly without recommendations for optimized stack', () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'cursor', plan: 'Pro', monthlySpend: 100, seats: 5 }, // 5 * 20 = 100
      ],
    };
    
    const result = runAudit(input);
    expect(result.currentSpend).toBe(100);
    expect(result.projectedSpend).toBe(100);
    expect(result.monthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(0);
  });

  it('should identify overlapping coding copilots and suggest consolidation', () => {
    const input: AuditInput = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'cursor', plan: 'Pro', monthlySpend: 200, seats: 10 },
        { toolId: 'github_copilot', plan: 'Business', monthlySpend: 190, seats: 10 },
      ],
    };

    const result = runAudit(input);
    expect(result.currentSpend).toBe(390);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].issue).toBe('Overlapping AI Coding Tools');
    expect(result.monthlySavings).toBe(190);
    expect(result.projectedSpend).toBe(200);
  });

  it('should identify overlapping chat assistants and suggest consolidation', () => {
    const input: AuditInput = {
      teamSize: 3,
      primaryUseCase: 'mixed',
      tools: [
        { toolId: 'claude', plan: 'Pro', monthlySpend: 60, seats: 3 },
        { toolId: 'chatgpt', plan: 'Plus', monthlySpend: 60, seats: 3 },
      ],
    };

    const result = runAudit(input);
    expect(result.currentSpend).toBe(120);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].issue).toBe('Overlapping Chat Assistants');
    expect(result.monthlySavings).toBe(60);
    expect(result.projectedSpend).toBe(60);
  });

  it('should suggest downgrade for small teams on enterprise/business plans', () => {
    const input: AuditInput = {
      teamSize: 2,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'github_copilot', plan: 'Enterprise', monthlySpend: 78, seats: 2 }, // 39 * 2
      ],
    };

    const result = runAudit(input);
    expect(result.currentSpend).toBe(78);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].issue).toBe('Unnecessary Enterprise/Team Plan');
    expect(result.recommendations[0].recommendation).toContain('Downgrade to Individual plan');
    // expected Individual cost = 2 * 10 = 20. Savings = 78 - 20 = 58.
    expect(result.monthlySavings).toBe(58);
  });

  it('should suggest Credex credits for high API spend', () => {
    const input: AuditInput = {
      teamSize: 10,
      primaryUseCase: 'data',
      tools: [
        { toolId: 'anthropic_api', plan: 'Pay-as-you-go', monthlySpend: 1000, seats: 1 },
      ],
    };

    const result = runAudit(input);
    expect(result.currentSpend).toBe(1000);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].issue).toBe('High unoptimized API Spend');
    expect(result.monthlySavings).toBe(200); // 20% of 1000
    expect(result.projectedSpend).toBe(800);
  });
});
