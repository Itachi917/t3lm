import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      // 1. Use the Google provider (Gemini 1.5 Flash is free & fast)
      model: google('gemini-1.5-flash'),
      
      system: `You are a helpful AI academic assistant for a student platform.
      - You are friendly, encouraging, and concise.
      - You can help with coding, math, and study schedules.`,
      
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("AI Error:", error);
    // This returns the error to the chat window so you can see it
    return new Response(JSON.stringify({ error: 'Check Vercel Env Variables' }), { status: 500 });
  }
}
