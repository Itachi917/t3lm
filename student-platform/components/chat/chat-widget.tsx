"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Connect to the AI API
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] md:w-[400px] h-[500px] bg-slate-900 border-2 border-[#EDBB00] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-[#004D98] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#EDBB00]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">AI Tutor</h3>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.length === 0 && (
              <div className="text-center mt-10 opacity-50 space-y-2">
                <Bot className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-sm text-slate-400">Ask me anything about your studies!</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] text-sm ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-[#004D98] text-white" : "bg-slate-800 text-[#EDBB00]"}`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-3 rounded-2xl shadow-sm ${m.role === "user" ? "bg-[#004D98] text-white rounded-tr-none" : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 text-sm">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#EDBB00]" />
                 </div>
                 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a question..."
              className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004D98]"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-[#EDBB00] text-[#004D98] hover:bg-[#A50044] hover:text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            h-16 w-16 rounded-full shadow-[0_0_20px_rgba(237,187,0,0.5)] transition-all duration-300 hover:scale-110 border-4 border-white flex items-center justify-center
            ${isOpen ? "bg-slate-700 text-white" : "bg-[#EDBB00] text-[#004D98] hover:bg-[#A50044] hover:text-white"}
        `}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  )
}
