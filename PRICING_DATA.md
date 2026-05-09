# AI Tool Pricing Data

This document outlines the standard pricing for various AI tools supported by SpendPilot. This data powers the deterministic audit engine.

## Coding Copilots
- **Cursor**
  - Pro: $20/user/month
  - Business: $40/user/month
- **GitHub Copilot**
  - Individual: $10/user/month
  - Business: $19/user/month
  - Enterprise: $39/user/month
- **Windsurf**
  - Pro: $15/user/month (estimated)
  - Team: $25/user/month (estimated)

## General AI Assistants (Chat)
- **Claude**
  - Pro: $20/user/month
  - Team: $30/user/month (minimum 5 seats usually, but evaluated on a per-seat basis for simplicity)
- **ChatGPT**
  - Plus: $20/user/month
  - Team: $30/user/month
- **Gemini**
  - Advanced: $20/user/month

## APIs
- **Anthropic API**
  - Pay-as-you-go (Metered)
- **OpenAI API**
  - Pay-as-you-go (Metered)

## Logic Rules & Assumptions
- **Consolidation**: Using multiple Coding Copilots or multiple Chat Assistants is considered overlapping. The engine will recommend consolidating to a single primary tool per category.
- **Downgrades**: If a user is on a 'Team' or 'Business' plan but the overall team size is very small (< 3), a downgrade to 'Pro' or 'Individual' may be suggested.
- **Credits**: API spend exceeding $500/month triggers a recommendation to seek infrastructure credits (e.g., via Credex).
