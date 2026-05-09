# Architecture

SpendPilot is built using a modern, scalable serverless architecture.

## Frontend
- **Framework**: Next.js 15 App Router.
- **Styling**: Tailwind CSS + custom glassmorphism utilities. UI components are built using `shadcn/ui`.
- **State Management**: React Hook Form manages form state. `localStorage` is used to persist the audit form state before submission.
- **Animation**: Framer motion / CSS animations for smooth transitions.

## Backend / API
- Next.js Route Handlers (`/api/*`) are used as the backend.
- **`/api/audit`**: Handles POST requests from the form. Runs the deterministic logic (`src/lib/audit-engine.ts`), queries Anthropic for the summary, saves data to Supabase, and returns a unique `slug`.
- **`/api/audit/[slug]`**: Handles GET requests to retrieve a specific audit for the shareable results page.
- **`/api/lead`**: Handles email capture and triggers a confirmation email using Resend.

## Core Logic (Deterministic Engine)
The core value proposition of SpendPilot relies on a strict, deterministic rule engine (`src/lib/audit-engine.ts`) rather than LLM inference.
- **Pricing Data**: Hardcoded structures in `src/lib/pricing-data.ts`.
- **Rules**: Consolidates overlapping coding assistants, chat assistants, and suggests plan downgrades for small teams using enterprise tiers.

## Database (Supabase)
- **`audits`**: Stores the high-level audit (spend, savings, AI summary). Uses a `slug` for unique, unguessable public URLs.
- **`audit_tools`**: Stores the specific tools inputted and the recommendation per tool.
- **`leads`**: Stores captured emails for follow-up.
