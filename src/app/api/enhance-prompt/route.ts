import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert prompt engineer. Improve and enhance the following system prompt for clarity, effectiveness, and best practices. Only return the improved prompt.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    const enhanced = completion.choices?.[0]?.message?.content?.trim();
    if (!enhanced) throw new Error('No enhanced prompt returned');
    return new Response(JSON.stringify({ enhanced }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to enhance prompt' }), { status: 500 });
  }
}
