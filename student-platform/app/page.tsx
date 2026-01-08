import { Button } from "@/components/ui/button";
import { Book, Trophy, Target, Zap, PlayCircle } from 'lucide-react';
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name || "Scholar";

  return (
    <div className="space-y-8">
      {/* Hero Banner - Keeps the Gradient & Gold Border */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#004D98] to-[#A50044] p-8 md:p-12 text-white border-b-4 border-[#EDBB00]">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
            WELCOME <span className="text-[#EDBB00]">{userName}</span>!
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-lg">
            Level 2 Scholar • You have 3 assignments pending this week.
          </p>
          <div className="mt-6 flex gap-4">
            <Button className="bg-[#EDBB00] text-[#004D98] hover:bg-white hover:text-[#A50044] font-black uppercase tracking-widest text-lg px-8 py-6">
                Resume Learning
            </Button>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Stats Strip - "Match Stats" style but with Student Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-card text-card-foreground border-t-4 border-[#A50044] p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-muted-foreground uppercase">Active Courses</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black">3</p>
                <Book className="w-6 h-6 text-[#A50044]" />
            </div>
         </div>
         <div className="bg-card text-card-foreground border-t-4 border-[#004D98] p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-muted-foreground uppercase">Total XP</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black">1,450</p>
                <Trophy className="w-6 h-6 text-[#004D98]" />
            </div>
         </div>
         <div className="bg-card text-card-foreground border-t-4 border-[#EDBB00] p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-muted-foreground uppercase">Streak</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black">5 Days</p>
                <Zap className="w-6 h-6 text-[#EDBB00]" />
            </div>
         </div>
         <div className="bg-card text-card-foreground border-t-4 border-slate-500 p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-muted-foreground uppercase">Tasks</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-black">4</p>
                <Target className="w-6 h-6 text-slate-500" />
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Latest Updates */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                <h2 className="text-2xl font-black uppercase text-[#004D98]">Dashboard Updates</h2>
                <Button variant="link" className="text-[#A50044] font-bold uppercase">View All</Button>
            </div>

            {/* Content Card */}
            <div className="group relative overflow-hidden rounded-lg bg-card border shadow-sm transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 bg-[#A50044] text-white text-xs font-bold px-3 py-1 uppercase">
                    New Content
                </div>
                <div className="p-6 pt-10">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#A50044] transition-colors">
                        Python: Advanced Loops
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Dr. Sarah Connor has uploaded the new lecture notes. Don't forget to complete the quiz before Friday.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-[#004D98]">
                        <span>Start Lesson</span>
                        <PlayCircle className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Upcoming Deadline */}
        <div className="space-y-6">
             <div className="bg-[#004D98] text-white rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <h3 className="text-sm font-bold text-[#EDBB00] uppercase tracking-widest mb-2">Assignment Due</h3>
                    <div className="text-5xl font-black mb-2">14:00</div>
                    <p className="font-medium mb-6">Introduction to Algorithms</p>
                    <Button className="w-full bg-[#A50044] hover:bg-[#800033] text-white font-bold uppercase">
                        Submit Now
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
