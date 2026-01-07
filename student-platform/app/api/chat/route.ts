
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Simple simulated AI logic
    let reply = "I'm not sure how to help with that yet. Try asking about Python, the schedule, or exams.";

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        reply = "Hello! I'm your CyberLearn AI study buddy. How can I help you today?";
    } else if (lowerMsg.includes('python')) {
        reply = "Python is a high-level, interpreted programming language. In our 'Intro to Python' course, we cover variables, loops, and functions. Would you like a quick quiz?";
    } else if (lowerMsg.includes('quiz')) {
        reply = "Here's a quick question: What is the output of `print(2 ** 3)` in Python?";
    } else if (lowerMsg.includes('exam') || lowerMsg.includes('test')) {
        reply = "Don't panic! Check the course schedule for exam dates. The best way to prepare is to review the notes in the Resources tab.";
    } else if (lowerMsg.includes('schedule') || lowerMsg.includes('timetable')) {
        reply = "You can find all staff office hours in the Staff section. Dr. Sarah Connor is available Mon/Wed 10:00-12:00.";
    } else if (context?.currentPath?.includes('courses')) {
        reply = "I see you're browsing courses. Need a recommendation? The 'Modern Web Development' course is very popular.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
