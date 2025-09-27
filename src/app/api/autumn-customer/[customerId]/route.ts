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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const featureId = body.feature_id || body.featureId || 'prostatus';
  if (!customerId || !featureId) {
    return NextResponse.json({ error: 'Missing customerId or featureId' }, { status: 400 });
  }

  try {
    const apiRes = await fetch('https://api.useautumn.com/v1/check', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTUMN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        feature_id: featureId,
      }),
    });
    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to check Autumn feature', details: String(err) }, { status: 500 });
  }
}
