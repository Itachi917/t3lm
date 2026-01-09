"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  // 1. Connect to the Brain
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onError: (err) => console.error("AI Error:", err),
  })

  // 2. Auto-scroll Logic
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 2147483647, // Max Z-Index
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          marginBottom: '16px',
          width: '350px',
          height: '500px',
          backgroundColor: '#0f172a', // Slate-900
          border: '2px solid #EDBB00', // Gold Border
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ padding: '16px', backgroundColor: '#004D98', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               {/* Sparkle Icon */}
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EDBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               <span style={{ fontWeight: 'bold', color: 'white' }}>AI Tutor</span>
               <span style={{ fontSize: '10px', backgroundColor: '#22c55e', color: '#0f172a', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>ONLINE</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✕</button>
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: 'rgba(2, 6, 23, 0.5)' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5, color: '#94a3b8' }}>
                <p>👋 Ask me anything about your studies!</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', marginBottom: '12px', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px',
                  borderRadius: '12px',
                  borderTopRightRadius: m.role === 'user' ? '0' : '12px',
                  borderTopLeftRadius: m.role === 'user' ? '12px' : '0',
                  backgroundColor: m.role === 'user' ? '#004D98' : '#1e293b',
                  color: m.role === 'user' ? 'white' : '#e2e8f0',
                  border: m.role === 'assistant' ? '1px solid #334155' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
               <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b', color: '#EDBB00', fontSize: '12px' }}>
                     Typing...
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} style={{ padding: '12px', backgroundColor: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a question..."
              style={{
                flex: 1,
                backgroundColor: '#020617',
                border: '1px solid #334155',
                color: 'white',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: '#EDBB00',
                color: '#004D98',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: isOpen ? '#334155' : '#EDBB00',
          border: '4px solid white',
          boxShadow: '0 0 20px rgba(237,187,0,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
      >
        {isOpen ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#004D98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        )}
      </button>
    </div>
  )
}
