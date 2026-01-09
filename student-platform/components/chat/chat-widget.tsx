"use client"

export function ChatWidget() {
  return (
    <button 
      onClick={() => alert("I work!")}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
        color: 'white',
        zIndex: 999999,
        fontWeight: 'bold',
        border: '5px solid yellow',
        borderRadius: '10px',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}
    >
      CLICK ME
    </button>
  )
}
