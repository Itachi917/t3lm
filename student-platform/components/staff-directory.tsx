"use client"

import { useState } from "react"
import { Search, User, MapPin, Clock, Calendar, ChevronDown, ChevronUp, Mail } from "lucide-react"

// --- HELPERS (Same as Timetable Page) ---
const dayMap: { [key: string]: number } = { "SU": 1, "MO": 2, "TU": 3, "WE": 4, "TH": 5 };
const days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
const startHour = 8;
const endHour = 19;
const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);

function parseTimeSlots(timeString: string) {
  const regex = /\[\s*(\d{2}:\d{2})_(\d{2}:\d{2})\s*\]\s*([A-Z\s]+)/g;
  const slots = [];
  let match;
  while ((match = regex.exec(timeString)) !== null) {
    const start = match[1]; 
    const end = match[2];   
    const daysStr = match[3].trim(); 
    const dayCodes = daysStr.split(/\s+/); 
    for (const code of dayCodes) {
      if (dayMap[code] !== undefined) {
        slots.push({
          colIndex: dayMap[code],
          start,
          end,
          startRow: parseInt(start.split(':')[0]) - startHour + 1,
          span: parseInt(end.split(':')[0]) - parseInt(start.split(':')[0])
        });
      }
    }
  }
  return slots;
}

type StaffMember = {
  name: string;
  sections: any[];
}

export function StaffDirectory({ staffList }: { staffList: StaffMember[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null)

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExpand = (name: string) => {
    setExpandedStaff(expandedStaff === name ? null : name)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for a professor (e.g. Dr. Eimad)..." 
          className="w-full pl-12 p-4 rounded-xl bg-white border-2 border-slate-200 focus:border-[#004D98] focus:outline-none shadow-sm text-lg font-bold placeholder:font-normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Staff List */}
      <div className="grid gap-4">
        {filteredStaff.map((staff) => {
          const isExpanded = expandedStaff === staff.name;
          
          // Prepare events only if expanded to save performance
          const events = isExpanded ? staff.sections.flatMap(sec => {
            const slots = parseTimeSlots(sec.time);
            return slots.map(slot => ({
              ...slot,
              subjectCode: sec.subjectId, // Using ID as code for now
              type: sec.type,
              room: sec.room,
              colorClass: sec.type === 'Lecture' 
                ? 'bg-[#004D98] border-[#003870] text-white' 
                : 'bg-[#A50044] border-[#800033] text-white'
            }));
          }) : [];

          return (
            <div key={staff.name} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              
              {/* Header (Clickable) */}
              <div 
                onClick={() => toggleExpand(staff.name)}
                className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? "bg-slate-50" : "hover:bg-slate-50"}`}
              >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#004D98] rounded-full flex items-center justify-center text-[#EDBB00]">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#004D98] uppercase">{staff.name}</h3>
                        <p className="text-sm font-bold text-slate-500">{staff.sections.length} Classes Assigned</p>
                    </div>
                 </div>
                 <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? "rotate-180 bg-slate-200" : "bg-slate-100"}`}>
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                 </div>
              </div>

              {/* Expanded Timetable */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-200 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase text-slate-400">
                        <Calendar className="w-4 h-4" /> Weekly Schedule
                    </div>
                    
                    {/* MINI CSS GRID TIMETABLE */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner">
                        <div className="overflow-x-auto">
                            <div className="min-w-[600px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] auto-rows-[60px]">
                                
                                {/* Header Row */}
                                <div className="bg-slate-50 border-r border-b border-slate-200"></div>
                                {days.map(day => (
                                    <div key={day} className="bg-[#004D98] text-white text-center text-xs font-bold uppercase p-2 border-r border-[#003870] flex items-center justify-center">
                                        {day}
                                    </div>
                                ))}

                                {/* Time Labels */}
                                <div className="col-start-1 row-span-full grid grid-rows-[repeat(11,60px)] border-r border-slate-200 bg-slate-50">
                                    {hours.map(h => (
                                        <div key={h} className="text-[10px] text-slate-500 font-mono font-bold flex justify-center pt-1 border-b border-slate-100">
                                            {h}:00
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Body */}
                                <div className="col-start-2 col-span-5 row-span-full grid grid-cols-5 grid-rows-[repeat(11,60px)] relative bg-slate-50/30">
                                    {/* Lines */}
                                    {hours.map((_, r) => days.map((_, c) => (
                                        <div key={`${r}-${c}`} className="border-r border-b border-slate-200" style={{gridRow: r+1, gridColumn: c+1}} />
                                    )))}

                                    {/* Events */}
                                    {events.map((evt, i) => (
                                        <div
                                            key={i}
                                            style={{ gridColumn: evt.colIndex, gridRow: `${evt.startRow} / span ${evt.span}` }}
                                            className="p-0.5"
                                        >
                                            <div className={`w-full h-full rounded p-1 text-[10px] leading-tight flex flex-col justify-center shadow-sm border-l-2 ${evt.colorClass}`}>
                                                <div className="font-black uppercase truncate">{evt.subjectCode}</div>
                                                <div className="opacity-90 truncate">{evt.room || "TBA"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredStaff.length === 0 && (
            <div className="text-center py-10 text-slate-500">No staff found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  )
}
