"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
  const [open, setOpen] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-[#004D98] border-[#EDBB00] text-white p-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EDBB00] bg-[#A50044]">
          <DialogHeader>
            <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-[#EDBB00]" />
                <DialogTitle className="text-2xl font-black italic uppercase text-[#EDBB00]">
                    Select Your Squad
                </DialogTitle>
            </div>
            <DialogDescription className="text-slate-200">
              Choose your exact lectures and practicals from the list below.
            </DialogDescription>
          </DialogHeader>
          <input 
            type="text" 
            placeholder="Search Subject (e.g. COMP1213)..." 
            className="mt-4 w-full p-3 rounded bg-white text-black font-bold uppercase placeholder:normal-case"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100">
          {filteredSubjects.map((subject) => (
            <div key={subject.code} className="bg-white border border-slate-300 rounded-lg p-4 shadow-sm text-slate-900">
              <h3 className="font-bold text-lg text-[#004D98] mb-2 flex justify-between">
                <span>{subject.name}</span>
                <span className="bg-slate-200 px-2 py-1 rounded text-sm">{subject.code}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subject.sections.map((sec) => {
                  const isSelected = selectedIds.includes(sec.id)
                  return (
                    <div 
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`
                        cursor-pointer p-3 rounded-md border-2 transition-all relative
                        ${isSelected 
                          ? "bg-[#004D98] border-[#A50044] text-white shadow-lg scale-105" 
                          : "bg-slate-50 border-slate-200 hover:border-[#004D98] text-slate-600"}
                      `}
                    >
                      <div className="flex justify-between items-start">
                         <div>
                            <div className={`text-xs font-bold uppercase mb-1 ${isSelected ? "text-[#EDBB00]" : "text-[#A50044]"}`}>
                                {sec.type} {sec.section}
                            </div>
                            <div className="text-sm font-black mb-1">{sec.time.split(']')[0].replace('[','').trim()}</div>
                            <div className="text-xs opacity-80 truncate max-w-[150px]">{sec.instructor || "Staff"}</div>
                         </div>
                         {isSelected && <Check className="w-6 h-6 text-[#EDBB00]" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDBB00] bg-[#003870] flex justify-between items-center">
          <p className="text-[#EDBB00] font-bold">{selectedIds.length} Classes Selected</p>
          <Button 
            onClick={async () => {
              await saveScheduleAction(selectedIds)
              window.location.reload()
            }}
            disabled={selectedIds.length === 0}
            className="bg-[#EDBB00] text-[#004D98] hover:bg-white hover:text-[#A50044] font-black uppercase tracking-widest"
          >
            Confirm Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
