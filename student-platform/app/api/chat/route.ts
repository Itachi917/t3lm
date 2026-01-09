import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // SWITCHED TO 'gpt-3.5-turbo' -> This is much safer for new accounts
    const result = streamText({
      model: openai('gpt-3.5-turbo'), 
      system: `You are a helpful academic assistant for T3lm.app.
      Your traits:
      - Friendly, encouraging, and knowledgeable about IT.
      - Answer concisely unless asked for detail.`,
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(JSON.stringify({ error: 'Check Vercel Logs' }), { status: 500 });
  }
}
