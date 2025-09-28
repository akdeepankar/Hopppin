import { NextRequest, NextResponse } from 'next/server';
// Removed invalid import of RouteContext

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await context.params;
  let body;
  try {
    body = await req.json();
  } catch {
    console.error('[Autumn API] Invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const featureId = body.feature_id || body.featureId || 'prostatus';
  if (!customerId || !featureId) {
    console.error('[Autumn API] Missing customerId or featureId', { customerId, featureId });
    return NextResponse.json({ error: 'Missing customerId or featureId' }, { status: 400 });
  }

  try {
    const requestPayload = {
      customer_id: customerId,
      feature_id: featureId,
    };
    console.log('[Autumn API] Sending request:', requestPayload);
    const apiRes = await fetch('https://api.useautumn.com/v1/check', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTUMN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });
    const data = await apiRes.json();
    console.log('[Autumn API] Response:', { status: apiRes.status, data });
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: any) {
    console.error('[Autumn API] Error:', err);
    return NextResponse.json({ error: 'Failed to check Autumn feature', details: String(err) }, { status: 500 });
  }
}
