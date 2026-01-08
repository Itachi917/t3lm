import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Calendar, MapPin, User } from "lucide-react";

// --- HELPERS ---
const dayMap: { [key: string]: number } = {
  "SU": 0, "MO": 1, "TU": 2, "WE": 3, "TH": 4
};
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

// Constants for Layout
const ROW_HEIGHT_PX = 128; // Taller rows (was 96)
const ROW_HEIGHT_CLASS = "h-32"; // Tailwind class matching 128px

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
          dayIndex: dayMap[code],
          start,
          end,
          startHour: parseInt(start.split(':')[0]),
          endHour: parseInt(end.split(':')[0])
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <h1 className="text-3xl font-black text-[#004D98] mb-2 uppercase">No Schedule Found</h1>
        <p className="text-lg">Go to the dashboard to select your classes first.</p>
      </div>
    );
  }

  // Define Grid Range (e.g., 08:00 to 19:00)
  const startHour = 8;
  const endHour = 19; 
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  // Flatten events
  const events = user.schedule.flatMap(sec => {
    const slots = parseTimeSlots(sec.time);
    return slots.map(slot => ({
      ...slot,
      subjectCode: sec.subject.code,
      subjectName: sec.subject.name,
      type: sec.type,
      room: sec.room,
      instructor: sec.instructor,
      // Different colors for Lecture vs Practical
      color: sec.type === 'Lecture' 
        ? 'bg-[#004D98] border-[#003870] text-white' 
        : 'bg-[#A50044] border-[#800033] text-white'
    }));
  });

  return (
    <div className="p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-[#EDBB00] pb-4 shrink-0">
        <div>
            <h1 className="text-3xl font-black uppercase italic text-[#004D98] flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#A50044]" />
                My Timetable
            </h1>
            <p className="text-slate-500 font-medium">Weekly Schedule • Semester 1</p>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#004D98] rounded border border-slate-300 shadow-sm"></div>
                <span className="text-xs font-bold uppercase text-slate-600">Lecture</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#A50044] rounded border border-slate-300 shadow-sm"></div>
                <span className="text-xs font-bold uppercase text-slate-600">Practical</span>
            </div>
        </div>
      </div>

      {/* The Scrollable Grid Container */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-lg border border-slate-200 relative">
        {/* We force a minimum width of 1200px so columns are wide enough for text */}
        <div className="min-w-[1200px]">
            
            {/* Table Header (Days) */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] sticky top-0 z-20 bg-white shadow-sm border-b border-slate-200">
                <div className="p-4 bg-slate-50 border-r border-slate-200 text-center font-bold text-slate-400 text-xs uppercase flex items-center justify-center">
                    Time
                </div>
                {days.map(day => (
                    <div key={day} className="p-4 bg-[#004D98] text-[#EDBB00] text-center font-black uppercase text-sm border-r border-[#003870]/20 last:border-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Table Body */}
            <div className="relative grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr]">
                
                {/* Background Grid Lines & Hour Labels */}
                {hours.map((hour) => (
                   <>
                     {/* Hour Label */}
                     <div key={`label-${hour}`} className={`${ROW_HEIGHT_CLASS} border-r border-b border-slate-100 bg-slate-50 text-slate-400 text-xs font-mono font-bold flex justify-center pt-3`}>
                        {hour}:00
                     </div>
                     {/* Empty Cells for Days */}
                     {days.map((_, dayIdx) => (
                        <div key={`cell-${dayIdx}-${hour}`} className={`${ROW_HEIGHT_CLASS} border-r border-b border-slate-100`}></div>
                     ))}
                   </>
                ))}

                {/* Event Overlays */}
                {events.map((event, idx) => {
                    // Calculate positioning based on new taller rows
                    const topPosition = (event.startHour - startHour) * ROW_HEIGHT_PX; 
                    const duration = event.endHour - event.startHour;
                    const height = duration * ROW_HEIGHT_PX;
                    
                    // Column index (1-based for CSS Grid)
                    const colStart = event.dayIndex + 2; 

                    return (
                        <div
                            key={idx}
                            style={{
                                gridColumn: colStart,
                                gridRow: `1 / span ${hours.length}`,
                                top: `${topPosition}px`,
                                height: `${height}px`,
                                marginTop: '2px', // tiny gap from line
                                marginBottom: '2px'
                            }}
                            className={`
                                absolute w-[96%] left-[2%] z-10 rounded-lg p-3 shadow-md border-l-4 overflow-hidden group
                                ${event.color} transition-all hover:scale-[1.02] hover:z-20 cursor-pointer
                            `}
                        >
                            {/* Time Badge */}
                            <div className="inline-block bg-black/20 rounded px-1.5 py-0.5 text-[10px] font-black uppercase text-[#EDBB00] mb-1 tracking-wider">
                                {event.start} - {event.end}
                            </div>
                            
                            {/* Subject Name - Allows wrapping now */}
                            <div className="font-bold text-xs md:text-sm leading-tight mb-2 line-clamp-2 group-hover:line-clamp-none">
                                {event.subjectName}
                            </div>

                            {/* Details Footer */}
                            <div className="flex flex-col gap-1 mt-auto text-[10px] md:text-xs opacity-90 border-t border-white/20 pt-2">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#EDBB00]" />
                                    <span className="font-mono">{event.room || "TBA"}</span>
                                </div>
                                <div className="flex items-center gap-1 truncate">
                                    <User className="w-3 h-3 text-[#EDBB00]" />
                                    <span className="truncate">{event.instructor || "Staff"}</span>
                                </div>
                            </div>
                            
                            {/* Background Code Watermark */}
                            <div className="absolute top-2 right-2 opacity-10 font-black text-3xl pointer-events-none">
                                {event.subjectCode.replace(/[^0-9]/g, '').slice(-3)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
