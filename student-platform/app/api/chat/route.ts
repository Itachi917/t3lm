import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Try to call Google
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: 'You are a helpful academic assistant for T3lm.app.',
      messages,
    });

    // 2. Return the stream (Standard Way)
    return result.toDataStreamResponse();

  } catch (error: any) {
    // 3. SAFETY NET: If Google rejects the key, we catch the error here
    // and manually send it to the chat window so you can see it.
    
    const errorMessage = `GOOGLE API ERROR: ${error.message}`;
    console.error(errorMessage);

    // Manually format the error as a chat message
    const stream = new ReadableStream({
      start(controller) {
        // "0:" is the secret code for "Text Message"
        const text = JSON.stringify(errorMessage);
        controller.enqueue(new TextEncoder().encode(`0:${text}\n`));
        controller.close();
      },
    });

    return new Response(stream, { 
      headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
    });
  }
}
