import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(req: Request) {
  try {
    const { auditId, email, companyName, role } = await req.json();

    // Save to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('leads').insert({
        audit_id: auditId,
        email,
        company_name: companyName,
        role,
      });
    }

    // Send confirmation email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SpendPilot <audit@spendpilot.com>',
        to: email,
        subject: 'Your AI Stack Audit Results',
        html: `
          <h1>Your SpendPilot Audit is Ready</h1>
          <p>Thank you for running an audit with SpendPilot. You can view your results anytime using your unique link.</p>
          <p>If you had high savings opportunities, our partners at Credex may reach out to help you secure infrastructure credits.</p>
        `,
      });
    } else {
      console.log('RESEND_API_KEY not configured. Skipping email.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
