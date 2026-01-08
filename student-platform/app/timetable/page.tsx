import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Calendar, MapPin, User, Clock } from "lucide-react";

// --- HELPERS ---
const dayMap: { [key: string]: number } = {
  "SU": 1, "MO": 2, "TU": 3, "WE": 4, "TH": 5 // Grid Column Indices (1-based)
};
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

// Hours Range: 8:00 to 19:00 (12 Hours)
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
          colIndex: dayMap[code], // 1=Sun, 2=Mon...
          start,
          end,
          // Calculate Row Start (e.g., 8:00 is row 1, 9:00 is row 2)
          startRow: parseInt(start.split(':')[0]) - startHour + 1,
          // Calculate Duration (e.g., 2 hours = span 2)
          span: parseInt(end.split(':')[0]) - parseInt(start.split(':')[0])
        });
      }
    }
  }
  return slots;
}

export default async function TimetablePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { schedule: { include: { subject: true } } }
  });

  if (!user || !user.schedule.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Clock className="w-16 h-16 mb-4 text-slate-300" />
        <h1 className="text-3xl font-black text-[#004D98] mb-2 uppercase">Schedule Empty</h1>
        <p className="text-lg">Go to the dashboard to select your subjects.</p>
      </div>
    );
  }

  // Flatten events for the grid
  const events = user.schedule.flatMap(sec => {
    const slots = parseTimeSlots(sec.time);
    return slots.map(slot => ({
      ...slot,
      subjectCode: sec.subject.code,
      subjectName: sec.subject.name,
      type: sec.type,
      room: sec.room,
      instructor: sec.instructor,
      colorClass: sec.type === 'Lecture' 
        ? 'bg-[#004D98] border-[#003870] text-white hover:bg-[#003870]' 
        : 'bg-[#A50044] border-[#800033] text-white hover:bg-[#800033]'
    }));
  });

  return (
    <div className="p-4 md:p-8 space-y-8 h-screen flex flex-col bg-slate-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-[#EDBB00] pb-6 shrink-0 bg-white p-6 rounded-xl shadow-sm">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <div className="bg-[#EDBB00] p-2 rounded-lg text-[#004D98]">
                    <Calendar className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-black uppercase italic text-[#004D98] tracking-tighter">
                    Weekly Timetable
                </h1>
            </div>
            <p className="text-slate-500 font-bold ml-1">Semester 1 • 2024/2025</p>
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 mt-4 md:mt-0 bg-slate-100 p-3 rounded-lg">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#004D98] rounded border border-[#003870]"></div>
                <span className="text-xs font-black uppercase text-[#004D98] tracking-wide">Lecture</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#A50044] rounded border border-[#800033]"></div>
                <span className="text-xs font-black uppercase text-[#A50044] tracking-wide">Practical</span>
            </div>
        </div>
      </div>

      {/* The Grid Container */}
      <div className="flex-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header Row (Days) */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b-2 border-slate-200 bg-slate-50">
            <div className="p-4 text-center font-black text-slate-400 text-xs uppercase flex items-center justify-center border-r border-slate-200">
                Time
            </div>
            {days.map(day => (
                <div key={day} className="p-4 text-center font-black uppercase text-sm text-[#004D98] border-r border-slate-200 last:border-0">
                    {day}
                </div>
            ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] auto-rows-[100px]"> {/* Fixed row height 100px */}
                
                {/* Time Labels (Left Column) */}
                <div className="col-start-1 row-span-full grid grid-rows-[repeat(12,100px)] border-r-2 border-slate-200 bg-slate-50 z-10">
                    {hours.map((hour) => (
                        <div key={hour} className="border-b border-slate-200 text-xs font-mono font-bold text-slate-500 flex justify-center pt-2">
                            {hour}:00
                        </div>
                    ))}
                </div>

                {/* Grid Cells (The "Empty" Blocks) */}
                <div className="col-start-2 col-span-5 row-span-full grid grid-cols-5 grid-rows-[repeat(12,100px)] relative">
                    {/* Background Lines */}
                    {hours.map((_, r) => (
                        days.map((_, c) => (
                            <div 
                                key={`${r}-${c}`} 
                                className="border-r border-b border-slate-100 last:border-r-0"
                                style={{ gridRow: r + 1, gridColumn: c + 1 }}
                            />
                        ))
                    ))}

                    {/* THE EVENTS BLOCKS */}
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            style={{
                                gridColumn: event.colIndex,     // e.g. 1 for Sunday
                                gridRow: `${event.startRow} / span ${event.span}`, // e.g. Start at row 1, span 2 rows
                            }}
                            className="p-1" // Small gap for aesthetics
                        >
                            <div className={`
                                w-full h-full rounded-lg shadow-md border-l-4 p-3 flex flex-col justify-between cursor-pointer transition-all
                                ${event.colorClass}
                            `}>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-black uppercase bg-black/20 px-1.5 py-0.5 rounded text-[#EDBB00] tracking-wider">
                                            {event.start}
                                        </span>
                                        <span className="text-[10px] font-bold opacity-60 uppercase">{event.type}</span>
                                    </div>
                                    <h3 className="font-bold text-xs md:text-sm leading-tight line-clamp-2 md:line-clamp-3">
                                        {event.subjectName}
                                    </h3>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-white/20 flex flex-col gap-1 text-[10px] md:text-xs">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MapPin className="w-3 h-3 text-[#EDBB00]" />
                                        <span className="uppercase tracking-wide">{event.room || "TBA"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-90 truncate">
                                        <User className="w-3 h-3 text-[#EDBB00]" />
                                        <span>{event.instructor || "Staff"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
