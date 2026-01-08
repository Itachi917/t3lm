import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight, MoreVertical, FileText, Video, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // 1. Fetch User's Schedule with Subject Info
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
            <BookOpen className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-black text-[#004D98] mb-2 uppercase">No Courses Found</h1>
        <p className="text-slate-500 max-w-md mb-8">
            You haven't selected your schedule yet. Go to the dashboard to pick your subjects first.
        </p>
        <Link href="/">
            <Button className="bg-[#EDBB00] text-[#004D98] hover:bg-[#A50044] hover:text-white font-black uppercase tracking-widest px-8 py-6">
                Go to Dashboard
            </Button>
        </Link>
      </div>
    );
  }

  // 2. Deduplicate Subjects
  // (You might have 3 sections for "Math", but we only want 1 Course Card)
  const uniqueSubjectsMap = new Map();
  
  user.schedule.forEach(sec => {
    if (!uniqueSubjectsMap.has(sec.subject.code)) {
      uniqueSubjectsMap.set(sec.subject.code, sec.subject);
    }
  });

  const myCourses = Array.from(uniqueSubjectsMap.values());

  return (
    <div className="p-6 md:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-[#A50044] pb-6">
        <div>
            <h1 className="text-4xl font-black uppercase italic text-[#004D98] tracking-tighter mb-2">
                My Courses
            </h1>
            <p className="text-slate-500 font-bold">
                Semester 1 • {myCourses.length} Active Subjects
            </p>
        </div>
        <div className="hidden md:block">
             <div className="bg-[#004D98] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg border border-[#EDBB00]">
                STUDENT ID: <span className="text-[#EDBB00] font-mono">{user.id.slice(0,8).toUpperCase()}</span>
             </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myCourses.map((subject, index) => (
          <div 
            key={subject.code} 
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full relative"
          >
            {/* Card Header (Colored Bar) */}
            <div className={`h-2 w-full ${index % 2 === 0 ? 'bg-[#004D98]' : 'bg-[#A50044]'}`}></div>
            
            <div className="p-6 flex-1 flex flex-col">
                {/* Top Row */}
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-100 text-slate-600 font-mono font-bold text-xs px-2 py-1 rounded">
                        {subject.code}
                    </span>
                    <button className="text-slate-300 hover:text-[#004D98]">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-[#004D98] leading-tight mb-4 group-hover:text-[#A50044] transition-colors">
                    {subject.name}
                </h3>

                {/* Quick Stats (Placeholder for future content) */}
                <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 hover:bg-[#EDBB00]/20 transition-colors cursor-pointer">
                        <Folder className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">Files</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 hover:bg-[#EDBB00]/20 transition-colors cursor-pointer">
                        <Video className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">Lecs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 hover:bg-[#EDBB00]/20 transition-colors cursor-pointer">
                        <FileText className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">Notes</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link href={`/courses/${subject.code}`} className="w-full">
                    <Button className="w-full bg-white border-2 border-[#004D98] text-[#004D98] hover:bg-[#004D98] hover:text-white font-black uppercase tracking-widest group-hover:bg-[#A50044] group-hover:border-[#A50044] group-hover:text-white transition-all">
                        View Content <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Background Decoration Icon */}
            <GraduationCap className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
