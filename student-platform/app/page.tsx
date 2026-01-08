import { Button } from "@/components/ui/button";
import { Book, Trophy, Target, Zap, PlayCircle, Clock } from 'lucide-react';
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { ScheduleOnboarding } from "@/components/schedule-onboarding";
import { revalidatePath } from "next/cache";

// --- SERVER ACTION: Save the Student's Schedule ---
async function saveSchedule(sectionIds: string[]) {
  "use server"
  console.log("Attempting to save schedule for IDs:", sectionIds);
  
  const session = await auth();
  if (!session?.user?.email) {
      console.error("No user session found during save.");
      return;
  }
  
  try {
    // 1. Clear existing schedule (optional, but safer)
    await prisma.user.update({
        where: { email: session.user.email },
        data: { schedule: { set: [] } }
    });

    // 2. Connect new sections
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        schedule: {
          connect: sectionIds.map(id => ({ id }))
        }
      }
    });
    
    console.log("Schedule saved successfully!");
    revalidatePath("/"); // Force the dashboard to update immediately
  } catch (error) {
    console.error("FAILED to save schedule. DB Error:", error);
    // This usually happens if the DATABASE_URL is wrong (missing https://)
    throw error;
  }
}

// --- HELPER: Calculate the Next Class ---
function getNextClass(schedule: any[]) {
    if (!schedule || schedule.length === 0) return null;

    // Get current day/time
    const now = new Date();
    const daysMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const currentDay = daysMap[now.getDay()]; // e.g., "MO"
    const currentHour = now.getHours();

    // Simple Logic: Find a class today that hasn't started yet
    // Data Format: "[ 13:00_14:00 ] MO SU TU"
    const upcoming = schedule.find((sec: any) => {
        const timePart = sec.time.split(']')[0].replace('[','').trim(); // "13:00_14:00"
        const dayPart = sec.time.split(']')[1] || ""; // " MO SU TU"
        
        const startTime = parseInt(timePart.split('_')[0].split(':')[0]); // 13

        // Check if class is Today AND later than now
        return dayPart.includes(currentDay) && startTime > currentHour;
    });

    // If no class left today, show the first one from the list as a fallback
    return upcoming || schedule[0];
}

export default async function Home() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // 1. Fetch User Data with Schedule
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
        schedule: { 
            include: { subject: true },
            orderBy: { time: 'asc' } // Sort roughly by time string
        } 
    }
  });

  // 2. IF NO SCHEDULE: Show Onboarding
  if (!user?.schedule || user.schedule.length === 0) {
    const allSubjects = await prisma.universitySubject.findMany({
      include: { sections: true },
      orderBy: { code: 'asc' }
    });
    
    // Pass the Server Action to the component
    return (
      <ScheduleOnboarding 
        subjects={allSubjects} 
        saveScheduleAction={saveSchedule} 
      />
    );
  }

  // 3. RENDER DASHBOARD
  const nextClass = getNextClass(user.schedule);
  const enrolledCount = new Set(user.schedule.map(s => s.subject.code)).size;
  const userName = user.name || "Scholar";

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#004D98] to-[#A50044] p-8 md:p-12 text-white border-b-4 border-[#EDBB00] shadow-xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
            WELCOME <span className="text-[#EDBB00]">{userName}</span>!
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-lg">
            Enrolled in {enrolledCount} Subjects • Ready for your next session?
          </p>
          <div className="mt-6 flex gap-4">
             <Button className="bg-[#EDBB00] text-[#004D98] hover:bg-white hover:text-[#A50044] font-black uppercase tracking-widest text-lg px-8 py-6">
                Check Timetable
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white border-t-4 border-[#A50044] p-4 rounded shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase">Subjects</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-[#004D98]">{enrolledCount}</p>
                <Book className="w-6 h-6 text-[#A50044]" />
            </div>
         </div>
         <div className="bg-white border-t-4 border-[#004D98] p-4 rounded shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase">Weekly Hours</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-[#004D98]">{user.schedule.length * 2}</p>
                <Clock className="w-6 h-6 text-[#004D98]" />
            </div>
         </div>
         <div className="bg-white border-t-4 border-[#EDBB00] p-4 rounded shadow-sm opacity-60">
            <p className="text-xs font-bold text-slate-500 uppercase">Assignments</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-slate-400">0</p>
                <Target className="w-6 h-6 text-[#EDBB00]" />
            </div>
         </div>
         <div className="bg-white border-t-4 border-slate-500 p-4 rounded shadow-sm opacity-60">
            <p className="text-xs font-bold text-slate-500 uppercase">Streak</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-slate-400">1</p>
                <Zap className="w-6 h-6 text-slate-500" />
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Schedule List */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                <h2 className="text-2xl font-black uppercase text-[#004D98]">Your Schedule</h2>
                <Button variant="link" className="text-[#A50044] font-bold uppercase">View Full</Button>
            </div>

            <div className="grid gap-3">
                {user.schedule.map((sec: any) => (
                    <div key={sec.id} className="group bg-white border border-slate-200 hover:border-[#004D98] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm transition-all hover:shadow-md">
                        <div className="mb-2 md:mb-0">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#004D98] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{sec.subject.code}</span>
                                <span className="text-[#A50044] text-[10px] font-bold uppercase border border-[#A50044] px-2 py-0.5 rounded">{sec.type}</span>
                            </div>
                            <p className="font-bold text-slate-800 mt-1">{sec.subject.name}</p>
                            <p className="text-sm text-slate-500 font-mono">
                                {sec.time.replace('[', '').replace(']', '')}
                            </p>
                        </div>
                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                             <span className="bg-[#EDBB00] text-[#004D98] text-sm font-black px-3 py-1 rounded shadow-sm">
                                {sec.room || "TBA"}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Next Class Widget */}
        <div className="space-y-6">
             <div className="bg-[#004D98] text-white rounded-xl p-6 relative overflow-hidden shadow-lg border-2 border-[#EDBB00]">
                <div className="relative z-10 text-center">
                    <h3 className="text-sm font-bold text-[#EDBB00] uppercase tracking-widest mb-4 border-b border-[#EDBB00]/30 pb-2">
                        Next Class
                    </h3>
                    
                    {nextClass ? (
                        <>
                            <div className="text-5xl font-black mb-2 tracking-tighter text-white">
                                {nextClass.time.split(']')[0].replace('[','').split('_')[0].trim()}
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 mb-4 backdrop-blur-sm">
                                <p className="font-bold text-md leading-tight text-[#EDBB00] mb-1">{nextClass.subject.name}</p>
                                <p className="text-xs font-medium uppercase tracking-wide">{nextClass.type}</p>
                            </div>
                            <p className="text-sm font-mono opacity-80 mb-6 bg-[#A50044] inline-block px-3 py-1 rounded">
                                Room: {nextClass.room}
                            </p>
                        </>
                    ) : (
                        <div className="py-10">
                            <p className="text-2xl font-bold text-[#EDBB00]">All Done!</p>
                            <p className="text-sm opacity-80">No more classes today.</p>
                        </div>
                    )}

                    <Button className="w-full bg-[#A50044] hover:bg-white hover:text-[#A50044] text-white font-bold uppercase transition-colors">
                        Open Calendar
                    </Button>
                </div>
                {/* Decorative BG */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#A50044] rounded-full opacity-50 blur-3xl"></div>
             </div>
        </div>
      </div>
    </div>
  );
}
