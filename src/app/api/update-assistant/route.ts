import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: NextRequest) {
  try {
    const { assistantId, name, model, voice, content, spaceId } = await req.json();
    if (!assistantId) {
      return NextResponse.json({ success: false, error: 'assistantId is required' }, { status: 400 });
    }
    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });
    // Update the assistant in Vapi
    const updatedAssistant = await vapi.assistants.update(assistantId, {
      name,
      model: model
        ? {
            provider: 'openai',
            model,
            messages: [
              {
                role: 'system',
                content: content || 'You are a friendly support assistant. Keep responses under 30 words.'
              }
            ]
          }
        : undefined,
      voice: voice
        ? {
            provider: '11labs',
            voiceId: voice
          }
        : undefined,
    });

    // Optionally update assistantId in the space if spaceId is provided
    if (spaceId && assistantId) {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.spaces.updateSpaceAssistantId, {
        spaceId,
        assistantId,
      });
    }

    return NextResponse.json({ success: true, assistant: updatedAssistant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
