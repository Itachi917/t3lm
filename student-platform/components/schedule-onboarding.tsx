"use client"

import { useState } from "react"
import { Check, GraduationCap, ChevronDown, ChevronUp, Square, CheckSquare, Search, Clock, MapPin } from "lucide-react"

type Section = { id: string; type: string; section: number; time: string; instructor: string | null; room: string | null }
type Subject = { code: string; name: string; sections: Section[] }

export function ScheduleOnboarding({ 
  subjects, 
  saveScheduleAction 
}: { 
  subjects: Subject[], 
  saveScheduleAction: (ids: string[]) => Promise<void> 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // State to track which subjects are "Open" (Expanded)
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleSection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent clicking the section from closing the dropdown
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSubjectExpand = (code: string) => {
    setExpandedSubjects(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  // Filter logic
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Header - Barcelona Blue */}
        <div className="p-6 bg-[#004D98] text-white shrink-0 shadow-lg z-10">
          <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                  <div className="bg-[#A50044] p-3 rounded-xl text-[#EDBB00] shadow-md border border-[#EDBB00]/30">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase text-[#EDBB00] tracking-tighter">
                        Build Your Timetable
                    </h2>
                    <p className="text-slate-200 text-sm font-medium opacity-90">
                        Click on a subject to reveal lectures & practicals.
                    </p>
                  </div>
              </div>
              <div className="text-right hidden md:block">
                  <div className="text-[#EDBB00] font-black text-4xl leading-none">{selectedIds.length}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Sessions Added</div>
              </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative group">
             <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#004D98] transition-colors" />
             <input 
                type="text" 
                placeholder="Search subjects (e.g. COMP1213)..." 
                className="w-full pl-10 p-3 rounded-lg bg-white text-black font-bold border-2 border-transparent focus:border-[#EDBB00] focus:outline-none shadow-xl placeholder:text-slate-400 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-3">
          {filteredSubjects.map((subject) => {
            const isExpanded = expandedSubjects.includes(subject.code);
            // Count how many sections selected for THIS subject
            const selectedCountForSubject = subject.sections.filter(s => selectedIds.includes(s.id)).length;
            
            return (
              <div key={subject.code} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* 1. Subject Header (Clickable Dropdown Trigger) */}
                <div 
                    onClick={() => toggleSubjectExpand(subject.code)}
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                >
                    <div className="flex items-center gap-4">
                         {/* Chevron Icon */}
                        <div className={`p-2 rounded-full bg-slate-100 text-[#004D98] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                        
                        <div>
                            <h3 className="font-black text-lg text-[#004D98] uppercase tracking-tight leading-tight">
                                {subject.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {subject.code}
                                </span>
                                {selectedCountForSubject > 0 && (
                                    <span className="text-[10px] font-bold uppercase bg-[#EDBB00] text-[#004D98] px-2 py-0.5 rounded-full">
                                        {selectedCountForSubject} Selected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual hint if not expanded but selected */}
                    {!isExpanded && selectedCountForSubject > 0 && (
                        <div className="flex gap-1">
                            {Array.from({length: Math.min(selectedCountForSubject, 3)}).map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-[#A50044]"></div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* 2. Dropdown Body (Sections Grid) */}
                {isExpanded && (
                  <div className="p-5 pt-0 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider py-4 mb-2 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Available Sections
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subject.sections.map((sec) => {
                        const isSelected = selectedIds.includes(sec.id)
                        return (
                          <div 
                            key={sec.id}
                            onClick={(e) => toggleSection(e, sec.id)}
                            className={`
                              cursor-pointer p-4 rounded-lg border-2 transition-all relative select-none
                              ${isSelected 
                                ? "bg-white border-[#A50044] shadow-md ring-1 ring-[#A50044]" 
                                : "bg-white border-slate-200 hover:border-[#004D98]"}
                            `}
                          >
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded w-fit mb-2 ${isSelected ? "bg-[#004D98] text-white" : "bg-slate-100 text-slate-600"}`}>
                                      {sec.type} {sec.section}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                                      {sec.time.split(']')[0].replace('[','').trim()}
                                  </div>
                               </div>
                               {/* Checkbox */}
                               {isSelected 
                                  ? <CheckSquare className="w-6 h-6 text-[#A50044]" /> 
                                  : <Square className="w-6 h-6 text-slate-300 hover:text-[#004D98]" />
                               }
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-2 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{sec.room || "TBA"} • {sec.instructor || "Staff"}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSubjects.length === 0 && (
              <div className="text-center py-20 opacity-50">
                  <p className="text-2xl font-black text-slate-400">NO MATCHES</p>
                  <p className="text-slate-500">Try a different search term.</p>
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col">
              <span className="font-black text-[#004D98] text-2xl">{selectedIds.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Classes Selected</span>
          </div>
          
          <button 
            onClick={async () => {
              setLoading(true)
              await saveScheduleAction(selectedIds)
              window.location.reload()
            }}
            disabled={selectedIds.length === 0 || loading}
            className={`
                flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all
                ${selectedIds.length === 0 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-[#EDBB00] text-[#004D98] hover:bg-[#A50044] hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-1"}
            `}
          >
            {loading ? "Saving..." : "Confirm Schedule"}
            {!loading && <Check className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
