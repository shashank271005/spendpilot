-- Create Audits Table
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  team_size INTEGER NOT NULL,
  primary_use_case TEXT NOT NULL,
  total_current_spend NUMERIC(10, 2) NOT NULL,
  total_projected_spend NUMERIC(10, 2) NOT NULL,
  monthly_savings NUMERIC(10, 2) NOT NULL,
  annual_savings NUMERIC(10, 2) NOT NULL,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Audit Tools Table
CREATE TABLE public.audit_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  plan TEXT NOT NULL,
  monthly_spend NUMERIC(10, 2) NOT NULL,
  seats INTEGER NOT NULL,
  recommendation_type TEXT,
  recommendation_text TEXT,
  savings NUMERIC(10, 2) DEFAULT 0,
  confidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Leads Table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Allow public to insert audits (since it's a lead gen tool without auth)
CREATE POLICY "Enable insert for anonymous users" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anonymous users" ON public.audit_tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anonymous users" ON public.leads FOR INSERT WITH CHECK (true);

-- Allow public to select audits by slug
CREATE POLICY "Enable read access for all users" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.audit_tools FOR SELECT USING (true);
