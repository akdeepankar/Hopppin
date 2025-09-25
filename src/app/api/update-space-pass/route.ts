import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: NextRequest) {
  try {
    const { spaceId, passEnabled, passcode } = await req.json();
    if (!spaceId || typeof passEnabled !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Missing spaceId or passEnabled' }, { status: 400 });
    }
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation(api.spaces.updateSpacePass, {
      spaceId,
      passEnabled,
      passcode,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
