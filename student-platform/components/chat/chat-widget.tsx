"use client"

import { useState } from "react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  // --- SAFE MODE: AI Hook is commented out for testing ---
  // const { messages, input, ... } = useChat(...)
  
  // Fake messages to test the UI
  const messages = [
    { id: '1', role: 'assistant', content: 'Hello! I am the AI Tutor. This is a test message.' }
  ]
  const input = ""
  const isLoading = false

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] md:w-[400px] h-[500px] bg-slate-900 border-2 border-[#EDBB00] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-[#004D98] flex justify-between items-center shrink-0">
            <h3 className="font-bold text-white text-sm">AI Tutor (Test Mode)</h3>
            <button 
              className="text-white hover:bg-white/20 p-1 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] text-sm ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`p-3 rounded-2xl shadow-sm ${m.role === "user" ? "bg-[#004D98] text-white" : "bg-slate-800 text-slate-200"}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
            <input
              disabled
              placeholder="AI Disabled for Testing..."
              className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Toggle Button (Gold Bubble) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ boxShadow: '0 0 20px rgba(237,187,0,0.5)' }}
        className={`
            h-16 w-16 rounded-full transition-all duration-300 hover:scale-110 border-4 border-white flex items-center justify-center text-2xl font-bold
            ${isOpen ? "bg-slate-700 text-white" : "bg-[#EDBB00] text-[#004D98]"}
        `}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  )
}
