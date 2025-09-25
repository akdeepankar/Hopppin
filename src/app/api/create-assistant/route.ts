
import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: NextRequest) {
  try {
    const { name, model, voice, content, spaceId } = await req.json();
    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });
    const assistant = await vapi.assistants.create({
      name: name || 'Support Assistant',
      firstMessage: 'Hello! How can I help you today?',
      model: {
        provider: 'openai',
        model: model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: content || 'You are a friendly support assistant. Keep responses under 30 words.'
          }
        ]
      },
      voice: {
        provider: '11labs',
        voiceId: voice || '21m00Tcm4TlvDq8ikWAM'
      }
    });

    // Save assistantId to the space if spaceId is provided
    if (spaceId && assistant?.id) {
      // Use Convex HTTP client to call the mutation
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.spaces.updateSpaceAssistantId, {
        spaceId,
        assistantId: assistant.id,
      });
    }

    return NextResponse.json({ success: true, assistant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
