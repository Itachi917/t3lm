import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Check if the Key exists at all
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("CRITICAL: The Environment Variable 'GOOGLE_GENERATIVE_AI_API_KEY' is missing in Vercel.");
    }

    // 2. Try to generate text
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error: any) {
    // --- ERROR HANDLER ---
    // Instead of crashing, we send the error message back to the chat UI
    // so you can read it!
    const errorMessage = `SYSTEM ERROR: ${error.message}`;
    
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(errorMessage));
        controller.close();
      },
    });

    return new Response(stream, { 
      headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
    });
  }
}
