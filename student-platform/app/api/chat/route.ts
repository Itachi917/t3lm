import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Gemini 1.5 Flash (Fast & Free)
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: 'You are a helpful academic assistant for T3lm.app. You are friendly and concise.',
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Gemini Error:", error);
    return new Response(JSON.stringify({ error: 'AI Error' }), { status: 500 });
  }
}
