
import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assistantId = searchParams.get('assistantId');
    if (!assistantId) {
      return NextResponse.json({ success: false, error: 'assistantId is required' }, { status: 400 });
    }
    // Use Vapi SDK to get all calls for the assistant
    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });
    // The SDK does not provide a direct method to list calls by assistantId, so we use the REST API for listing,
    // but always use the SDK for fetching call details.
    // If in the future the SDK supports listing, replace this with vapi.calls.list({ assistantId })
    // For now, fallback to REST for listing, but always use SDK for details.
  let calls: any[] = [];
    // Only use SDK, do not fallback to REST
    if (typeof vapi.calls.list !== 'function') {
      return NextResponse.json({ success: false, error: 'Vapi SDK does not support listing calls by assistantId.' }, { status: 500 });
    }
  const sdkList = await vapi.calls.list({ assistantId });
    //console.log('Vapi SDK list response:', JSON.stringify(sdkList, null, 2));
    if (Array.isArray(sdkList)) {
      calls = sdkList;
    } else {
      return NextResponse.json({ success: false, error: 'Vapi SDK did not return an array of calls.', raw: sdkList }, { status: 500 });
    }
    // Always use SDK to get full details (including latest recordingUrl) for each call
    const detailedCalls = await Promise.all(
      calls.map(async (call: any) => {
        try {
          const fullCall = await vapi.calls.get(call.id);
          return { ...call, ...fullCall };
        } catch (e) {
          return call;
        }
      })
    );
  return NextResponse.json({ success: true, calls: detailedCalls, raw: sdkList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
