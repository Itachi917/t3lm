"use client"

import { useState } from "react"
// We use simple HTML buttons first to ensure no Icon crashes
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[300px] h-[400px] bg-slate-900 border-2 border-[#EDBB00] rounded-2xl shadow-2xl flex flex-col p-4 animate-in slide-in-from-bottom-5">
           <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
              <span className="font-bold text-white">AI Tutor</span>
              <button onClick={() => setIsOpen(false)} className="text-white">✕</button>
           </div>
           <div className="flex-1 text-slate-400 text-sm flex items-center justify-center">
              System Online.
           </div>
        </div>
      )}

      {/* The Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-[#EDBB00] rounded-full shadow-[0_0_20px_rgba(237,187,0,0.5)] border-4 border-white flex items-center justify-center text-2xl"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  )
}
