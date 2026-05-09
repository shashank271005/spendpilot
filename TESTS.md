# Testing Strategy

SpendPilot uses **Vitest** for unit testing, focusing primarily on the deterministic audit engine.

## Test Suites

### 1. Audit Engine Tests (`src/test/audit-engine.test.ts`)
This suite validates the core business logic.

**Covered Scenarios:**
- **No Savings:** Validates that a perfectly optimized stack correctly returns 0 savings and no recommendations.
- **Consolidation (Coding):** Validates that multiple coding copilots (e.g., Cursor + GitHub Copilot) trigger a consolidation recommendation and calculate savings correctly.
- **Consolidation (Chat):** Validates that multiple chat assistants (e.g., Claude + ChatGPT) trigger a consolidation recommendation.
- **Downgrades:** Validates that small teams using Enterprise/Business plans are suggested to downgrade to Pro/Individual plans.
- **Credit Opportunities:** Validates that high API spend (>$500/mo) triggers a recommendation for infrastructure credits.

## Running Tests
Run tests using:
\`\`\`bash
npm run test
\`\`\`
