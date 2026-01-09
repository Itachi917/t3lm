import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'), // Or 'gpt-3.5-turbo' for lower cost
    system: `You are a helpful academic assistant for T3lm.app.
    
    Your traits:
    - You are friendly, encouraging, and knowledgeable about IT and Computer Science.
    - You help students with coding questions (Python, Java, Web Dev).
    - You can explain complex university concepts simply.
    - Anser concisely unless asked for detail.`,
    messages,
  });

  return result.toDataStreamResponse();
}
