import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { VapiClient } from '@vapi-ai/server-sdk';

export async function POST(req: NextRequest) {
  try {
    const { spaceId, assistantId } = await req.json();
    if (!spaceId) {
      return NextResponse.json({ success: false, error: 'Missing spaceId' }, { status: 400 });
    }

    // If assistantId is provided, delete from Vapi
    if (assistantId) {
      const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });
      await vapi.assistants.delete(assistantId);
    }

    // Remove assistantId from Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation(api.spaces.updateSpaceAssistantId, {
      spaceId,
      assistantId: '',
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
