import { google } from '@ai-sdk/google';

// We manually simulate the AI stream to prevent crashing
export async function POST(req: Request) {
  try {
    // 1. Check the Key
    const hasKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const keyStatus = hasKey ? "✅ DETECTED" : "❌ MISSING";
    
    // 2. Prepare the Diagnostics Message
    const message = `DIAGNOSTICS REPORT:
    - Server Status: ONLINE
    - API Key: ${keyStatus}
    - AI Provider: Google Gemini
    
    If the Key is MISSING: Go to Vercel > Settings > Env Variables and add GOOGLE_GENERATIVE_AI_API_KEY.
    If the Key is DETECTED: Your Google Key might be invalid or blocked. Try generating a new one.`;

    // 3. Send it using the "Secret Code" format (Data Stream Protocol)
    // The '0:' prefix tells the frontend "This is a text chunk"
    const stream = new ReadableStream({
      start(controller) {
        const text = JSON.stringify(message); // JSON stringify handles newlines correctly
        controller.enqueue(new TextEncoder().encode(`0:${text}\n`));
        controller.close();
      },
    });

    return new Response(stream, { 
      headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
    });

  } catch (error: any) {
    // Catch-all for other crashes
    const errText = JSON.stringify(`CRITICAL SERVER CRASH: ${error.message}`);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`0:${errText}\n`));
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
  }
}
