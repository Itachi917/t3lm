"use client"

import { useState } from "react"
import { Check, GraduationCap, Square, CheckSquare, Search } from "lucide-react"

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

  // Filter logic
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-6xl h-[90vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Header - Barcelona Blue */}
        <div className="p-6 bg-[#004D98] text-white shrink-0">
          <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#A50044] p-2 rounded-lg text-[#EDBB00]">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase text-[#EDBB00] tracking-tighter">
                        Select Your Squad
                    </h2>
                    <p className="text-slate-200 text-sm font-medium">
                        Tick the boxes for your specific lectures & practicals.
                    </p>
                  </div>
              </div>
              <div className="text-right hidden md:block">
                  <div className="text-[#EDBB00] font-black text-4xl">{selectedIds.length}</div>
                  <div className="text-xs uppercase font-bold tracking-widest text-slate-300">Selected</div>
              </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
             <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
             <input 
                type="text" 
                placeholder="Search for a subject (e.g. Computer Networks)..." 
                className="w-full pl-10 p-3 rounded-lg bg-white text-black font-bold border-2 border-transparent focus:border-[#EDBB00] focus:outline-none shadow-xl placeholder:text-slate-400"
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {/* Scrollable List - White Background with Black Text */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8 space-y-6">
          {filteredSubjects.map((subject) => (
            <div key={subject.code} className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
              
              {/* Subject Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-black text-xl text-[#004D98] uppercase tracking-tight">
                    {subject.name}
                </h3>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-mono font-bold mt-2 md:mt-0 w-fit">
                    {subject.code}
                </span>
              </div>
              
              {/* Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {subject.sections.map((sec) => {
                  const isSelected = selectedIds.includes(sec.id)
                  return (
                    <div 
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`
                        cursor-pointer p-4 rounded-lg border-2 transition-all relative select-none flex flex-col justify-between h-full
                        ${isSelected 
                          ? "bg-[#004D98] border-[#A50044] shadow-md transform scale-[1.02]" 
                          : "bg-slate-50 border-slate-200 hover:border-[#004D98] hover:bg-white"}
                      `}
                    >
                      {/* Top Row: Type & Checkbox */}
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${isSelected ? "bg-[#A50044] text-white" : "bg-slate-200 text-slate-600"}`}>
                            {sec.type} {sec.section}
                         </span>
                         {/* Visible Checkbox Icon */}
                         {isSelected 
                            ? <CheckSquare className="w-6 h-6 text-[#EDBB00] fill-[#004D98]" /> 
                            : <Square className="w-6 h-6 text-slate-300" />
                         }
                      </div>

                      {/* Middle: Time */}
                      <div className={`text-sm font-black mb-1 ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {sec.time.split(']')[0].replace('[','').trim()}
                      </div>
                      
                      {/* Bottom: Instructor */}
                      <div className={`text-xs truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {sec.instructor || "TBA"}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredSubjects.length === 0 && (
              <div className="text-center py-20 opacity-50">
                  <p className="text-2xl font-black text-slate-400">NO MATCHES FOUND</p>
                  <p className="text-slate-500">Try searching for a different code or name.</p>
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          <div className="md:hidden">
              <span className="font-black text-[#004D98] text-xl">{selectedIds.length}</span>
              <span className="text-xs text-slate-500 uppercase ml-1">Selected</span>
          </div>
          
          <div className="ml-auto">
             <button 
                onClick={async () => {
                  setLoading(true)
                  await saveScheduleAction(selectedIds)
                  window.location.reload()
                }}
                disabled={selectedIds.length === 0 || loading}
                className={`
                    flex items-center gap-2 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all
                    ${selectedIds.length === 0 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-[#EDBB00] text-[#004D98] hover:bg-[#A50044] hover:text-white shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"}
                `}
              >
                {loading ? (
                    <span>Saving...</span>
                ) : (
                    <>
                        <Check className="w-6 h-6" />
                        Confirm Schedule
                    </>
                )}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}
