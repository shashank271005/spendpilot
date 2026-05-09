import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const savings = searchParams.get('savings') || '0';
    const numSavings = Number(savings);
    const formattedSavings = `$${numSavings.toLocaleString()}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(220, 38, 38, 0.15), transparent 60%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: '#dc2626',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px',
              }}
            >
              SP
            </div>
            <div style={{ color: '#ffffff', fontSize: 32, fontWeight: 700, letterSpacing: '-0.05em' }}>
              SpendPilot
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#a3a3a3', fontSize: 36, marginBottom: 20 }}>Potential Annual Savings</div>
            <div style={{ color: '#ffffff', fontSize: 120, fontWeight: 800, letterSpacing: '-0.05em' }}>
              {formattedSavings}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              color: '#737373',
              fontSize: 24,
            }}
          >
            Audit your AI stack at spendpilot.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
