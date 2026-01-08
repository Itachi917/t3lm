import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Clock, MapPin, Calendar } from "lucide-react";

// --- HELPERS ---

// Map string days to numbers (Sunday=0, Monday=1, etc.)
const dayMap: { [key: string]: number } = {
  "SU": 0, "MO": 1, "TU": 2, "WE": 3, "TH": 4
};

// Map day index back to name
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

// Parse the raw time string into usable blocks
function parseTimeSlots(timeString: string) {
  // Regex to find blocks like: [ 13:00_14:00 ] MO SU TU
  const regex = /\[\s*(\d{2}:\d{2})_(\d{2}:\d{2})\s*\]\s*([A-Z\s]+)/g;
  const slots = [];
  let match;

  while ((match = regex.exec(timeString)) !== null) {
    const start = match[1]; // 13:00
    const end = match[2];   // 14:00
    const daysStr = match[3].trim(); // MO SU TU
    const dayCodes = daysStr.split(/\s+/); // ['MO', 'SU', 'TU']

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

  // 1. Fetch User's Schedule
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      schedule: {
        include: { subject: true }
      }
    }
  });

  if (!user || !user.schedule.length) {
    return (
      <div className="p-10 text-center text-slate-500">
        <h1 className="text-2xl font-bold mb-2">No Schedule Found</h1>
        <p>Go to the dashboard to select your classes first.</p>
      </div>
    );
  }

  // 2. Process Data for the Grid
  // We need a grid from 08:00 (8) to 18:00 (18) or later
  const startHour = 8;
  const endHour = 19; 
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  // Flatten the schedule into renderable blocks
  const events = user.schedule.flatMap(sec => {
    const slots = parseTimeSlots(sec.time);
    return slots.map(slot => ({
      ...slot,
      subjectCode: sec.subject.code,
      subjectName: sec.subject.name,
      type: sec.type,
      room: sec.room,
      color: sec.type === 'Lecture' ? 'bg-[#004D98] border-[#003870]' : 'bg-[#A50044] border-[#800033]'
    }));
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-[#EDBB00] pb-4">
        <div>
            <h1 className="text-3xl font-black uppercase italic text-[#004D98] flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#A50044]" />
                My Timetable
            </h1>
            <p className="text-slate-500 font-medium">Weekly Schedule • Semester 1</p>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#004D98] rounded"></div>
                <span className="text-xs font-bold uppercase text-slate-600">Lecture</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#A50044] rounded"></div>
                <span className="text-xs font-bold uppercase text-slate-600">Practical</span>
            </div>
        </div>
      </div>

      {/* The Grid */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="min-w-[800px]">
            
            {/* Table Header (Days) */}
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200">
                <div className="p-4 bg-slate-50 border-r border-slate-200 text-center font-bold text-slate-400 text-xs uppercase">
                    Time
                </div>
                {days.map(day => (
                    <div key={day} className="p-4 bg-[#004D98] text-[#EDBB00] text-center font-black uppercase text-sm border-r border-[#003870]/20 last:border-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Table Body */}
            <div className="relative grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr]">
                
                {/* Background Grid Lines & Hour Labels */}
                {hours.map((hour, i) => (
                   <>
                     {/* Hour Label */}
                     <div key={`label-${hour}`} className="h-24 border-r border-b border-slate-100 bg-slate-50 text-slate-400 text-xs font-mono font-bold flex justify-center pt-2 relative">
                        {hour}:00
                     </div>
                     {/* Empty Cells for Days */}
                     {days.map((_, dayIdx) => (
                        <div key={`cell-${dayIdx}-${hour}`} className="h-24 border-r border-b border-slate-100 relative">
                            {/* This is just the background grid */}
                        </div>
                     ))}
                   </>
                ))}

                {/* Event Overlays (Absolute Positioning) */}
                {events.map((event, idx) => {
                    const topPosition = (event.startHour - startHour) * 96; // 96px is height of h-24
                    const duration = event.endHour - event.startHour;
                    const height = duration * 96;
                    
                    // Column calculation: 80px (label) + (dayIndex * 1/5th of remaining width)
                    // Since we use CSS grid, we can just assign grid-column.
                    // Grid columns are 1-based. Label is col 1. Days are cols 2-6.
                    const colStart = event.dayIndex + 2; 

                    return (
                        <div
                            key={idx}
                            style={{
                                gridColumn: colStart,
                                gridRow: `1 / span ${hours.length}`, // Span full height to allow absolute positioning inside
                                top: `${topPosition}px`,
                                height: `${height}px`,
                                marginTop: '1px' // visual adjustment
                            }}
                            className={`
                                absolute w-[96%] left-[2%] z-10 rounded-lg p-2 shadow-md flex flex-col justify-center
                                ${event.color} text-white border-l-4 overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer
                            `}
                        >
                            <div className="text-[10px] font-black uppercase text-[#EDBB00] mb-0.5 tracking-wider">
                                {event.start} - {event.end}
                            </div>
                            <div className="font-bold text-xs leading-tight mb-1 truncate">
                                {event.subjectName}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] opacity-90">
                                <MapPin className="w-3 h-3 text-[#EDBB00]" />
                                <span className="uppercase font-mono">{event.room || "TBA"}</span>
                            </div>
                            <div className="absolute top-1 right-1 opacity-20">
                                <span className="font-black text-2xl">{event.subjectCode.replace(/[^0-9]/g, '')}</span>
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
