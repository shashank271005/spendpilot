# SpendPilot

SpendPilot is an AI Spend Audit platform that helps startups analyze and optimize their AI tooling costs. It evaluates overlapping tools, suggests plan downgrades, and identifies infrastructure credit opportunities.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 & shadcn/ui
- Supabase (PostgreSQL Database)
- Resend (Transactional Emails)
- Anthropic API (AI Audit Summaries)
- Vitest (Testing)

## Getting Started

1. Clone the repository and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy the `.env.example` to `.env.local` and add your API keys.
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup
You will need to run the SQL migration found in `supabase/migrations/00001_initial_schema.sql` on your Supabase project to create the necessary tables (`audits`, `audit_tools`, `leads`).

## Testing
Run the vitest test suite with:
\`\`\`bash
npm run test
\`\`\`
