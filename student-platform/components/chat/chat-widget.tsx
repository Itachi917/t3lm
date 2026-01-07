
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hi there! I can help you find notes, explain concepts, or quiz you. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg, context: { currentPath: pathname } })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110"
        >
            <MessageSquare className="w-6 h-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 w-80 md:w-96 h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Study Buddy AI</h3>
                        <p className="text-xs text-emerald-400">Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[80%] rounded-2xl px-4 py-2 text-sm
                            ${m.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
                        `}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none border border-slate-700 px-4 py-2 text-sm flex gap-1">
                            <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                <input
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" onClick={handleSend} disabled={isLoading} className="rounded-full bg-emerald-500 hover:bg-emerald-600 h-9 w-9">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
