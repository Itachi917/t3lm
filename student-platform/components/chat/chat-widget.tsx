"use client"

import { useState } from "react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 2147483647, // Maximum integer value
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
          border: '2px solid #EDBB00',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ padding: '16px', backgroundColor: '#004D98', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               {/* Sparkle SVG */}
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EDBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               <span style={{ fontWeight: 'bold', color: 'white' }}>AI Tutor</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            System Online. <br/> (AI Disconnected for Safety Check)
          </div>
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
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? (
            // X Icon SVG
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
            // Message Icon SVG
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#004D98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        )}
      </button>
    </div>
  )
}
