import { Button } from "@/components/ui/button";
import { Book, Trophy, Target, Zap, PlayCircle } from 'lucide-react';
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { ScheduleOnboarding } from "@/components/schedule-onboarding";

// Server Action to save selection
async function saveSchedule(sectionIds: string[]) {
  "use server"
  const session = await auth()
  if (!session?.user?.email) return
  
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      schedule: {
        connect: sectionIds.map(id => ({ id }))
      }
    }
  })
}

// Helper to calculate "Next Class"
function getNextClass(schedule: any[]) {
    // Basic logic: Just return the first one for now as a demo
    // In a real app, you'd parse "MO TU" and timestamps
    if (!schedule || schedule.length === 0) return null;
    return schedule[0]; 
}

export default async function Home() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // 1. Fetch User & Schedule
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
        schedule: { 
            include: { subject: true } 
        } 
    }
  });

  // 2. IF NO SCHEDULE: Show Onboarding
  if (!user?.schedule || user.schedule.length === 0) {
    const allSubjects = await prisma.universitySubject.findMany({
      include: { sections: true },
      orderBy: { code: 'asc' }
    });
    
    return (
      <ScheduleOnboarding 
        subjects={allSubjects} 
        saveScheduleAction={saveSchedule} 
      />
    );
  }

  // 3. Normal Dashboard
  const nextClass = getNextClass(user.schedule);
  const enrolledCount = new Set(user.schedule.map(s => s.subject.code)).size;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#004D98] to-[#A50044] p-8 md:p-12 text-white border-b-4 border-[#EDBB00]">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
            WELCOME <span className="text-[#EDBB00]">{user.name}</span>!
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-lg">
            Enrolled in {enrolledCount} Subjects • {user.schedule.length} Total Sessions per week.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-card text-card-foreground border-t-4 border-[#A50044] p-4 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase">Subjects</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black">{enrolledCount}</p>
                <Book className="w-6 h-6 text-[#A50044]" />
            </div>
         </div>
         {/* ... (Keep other stats static for now) ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Schedule List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black uppercase text-[#004D98]">Your Weekly Schedule</h2>
            <div className="grid gap-4">
                {user.schedule.map((sec: any) => (
                    <div key={sec.id} className="bg-white border border-slate-200 p-4 rounded-lg flex justify-between items-center shadow-sm">
                        <div>
                            <p className="font-bold text-[#004D98]">{sec.subject.name}</p>
                            <p className="text-sm text-slate-500">{sec.type} • {sec.time.split(']')[0].replace('[','')}</p>
                        </div>
                        <div className="text-right">
                             <span className="bg-[#EDBB00] text-[#004D98] text-xs font-bold px-2 py-1 rounded">
                                {sec.room}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Next Class Widget */}
        <div className="space-y-6">
             <div className="bg-[#004D98] text-white rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <h3 className="text-sm font-bold text-[#EDBB00] uppercase tracking-widest mb-2">Next Class</h3>
                    
                    {nextClass ? (
                        <>
                            <div className="text-4xl font-black mb-2">
                                {nextClass.time.split(']')[0].replace('[','').split('_')[0].trim()}
                            </div>
                            <p className="font-medium mb-1 text-lg leading-tight">{nextClass.subject.name}</p>
                            <p className="text-sm opacity-70 mb-6">{nextClass.room} • {nextClass.building}</p>
                        </>
                    ) : (
                        <p className="text-2xl font-bold py-6">Free Time!</p>
                    )}

                    <Button className="w-full bg-[#A50044] hover:bg-[#800033] text-white font-bold uppercase">
                        View Full Calendar
                    </Button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
