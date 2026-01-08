"use client"

import { useState } from "react"
import { Check, GraduationCap } from "lucide-react"

// Define the shape of the data we expect
type Section = { id: string; type: string; section: number; time: string; instructor: string | null }
type Subject = { code: string; name: string; sections: Section[] }

export function ScheduleOnboarding({ 
  subjects, 
  saveScheduleAction 
}: { 
  subjects: Subject[], 
  saveScheduleAction: (ids: string[]) => Promise<void> 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleSection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    // Simple Full Screen Modal using fixed positioning (No external Dialog required)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col bg-[#004D98] border-2 border-[#EDBB00] rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EDBB00] bg-[#A50044] text-white">
          <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-[#EDBB00]" />
              <h2 className="text-2xl font-black italic uppercase text-[#EDBB00]">
                  Select Your Squad
              </h2>
          </div>
          <p className="text-slate-200 text-sm">
            Choose your exact lectures and practicals from the list below.
          </p>
          <input 
            type="text" 
            placeholder="Search Subject (e.g. COMP1213)..." 
            className="mt-4 w-full p-3 rounded bg-white text-black font-bold uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#EDBB00]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100">
          {filteredSubjects.map((subject) => (
            <div key={subject.code} className="bg-white border border-slate-300 rounded-lg p-4 shadow-sm text-slate-900">
              <div className="flex justify-between items-center mb-3 border-b pb-2 border-slate-100">
                <h3 className="font-bold text-lg text-[#004D98]">{subject.name}</h3>
                <span className="bg-slate-200 px-2 py-1 rounded text-xs font-mono font-bold">{subject.code}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subject.sections.map((sec) => {
                  const isSelected = selectedIds.includes(sec.id)
                  return (
                    <div 
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`
                        cursor-pointer p-3 rounded-md border-2 transition-all relative select-none
                        ${isSelected 
                          ? "bg-[#004D98] border-[#A50044] text-white shadow-lg scale-105 z-10" 
                          : "bg-slate-50 border-slate-200 hover:border-[#004D98] text-slate-600"}
                      `}
                    >
                      <div className="flex justify-between items-start">
                         <div>
                            <div className={`text-xs font-bold uppercase mb-1 ${isSelected ? "text-[#EDBB00]" : "text-[#A50044]"}`}>
                                {sec.type} {sec.section}
                            </div>
                            <div className="text-sm font-black mb-1 leading-tight">
                                {sec.time.split(']')[0].replace('[','').trim()}
                            </div>
                            <div className="text-xs opacity-80 truncate max-w-[150px]">
                                {sec.instructor || "Staff"}
                            </div>
                         </div>
                         {isSelected && <Check className="w-6 h-6 text-[#EDBB00]" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {filteredSubjects.length === 0 && (
              <div className="text-center text-slate-500 py-10 font-bold">
                  No subjects found matching "{searchTerm}"
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDBB00] bg-[#003870] flex justify-between items-center z-20">
          <p className="text-[#EDBB00] font-bold text-lg">{selectedIds.length} Classes Selected</p>
          <button 
            onClick={async () => {
              setLoading(true)
              await saveScheduleAction(selectedIds)
              window.location.reload()
            }}
            disabled={selectedIds.length === 0 || loading}
            className={`
                px-8 py-3 rounded font-black uppercase tracking-widest transition-colors
                ${selectedIds.length === 0 
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
                    : "bg-[#EDBB00] text-[#004D98] hover:bg-white hover:text-[#A50044]"}
            `}
          >
            {loading ? "Saving..." : "Confirm Schedule"}
          </button>
        </div>
      </div>
    </div>
  )
}
