
import { Button } from "@/components/ui/button";
import { Book, Trophy, Target, Zap } from 'lucide-react';
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name || "Alex Student (Dev)";



  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono">Welcome back, <span className="text-emerald-400">{userName}</span></h1>
          <p className="text-slate-400 mt-2">Level 2 Scholar • 120 XP to next level</p>
        </div>
        <div className="flex gap-4">
            <div className="text-right">
                <p className="text-sm text-slate-400 font-mono">CURRENT STREAK</p>
                <div className="flex items-center justify-end text-amber-400 gap-2">
                    <Zap className="fill-current w-5 h-5"/>
                    <span className="text-2xl font-bold">5 Days</span>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Book className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-mono">ACTIVE COURSES</p>
                    <p className="text-2xl font-bold">3</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Intro to Python</span>
                    <span className="text-emerald-400">85%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-mono">TOTAL POINTS</p>
                    <p className="text-2xl font-bold">1,450</p>
                </div>
            </div>
            <p className="text-sm text-slate-400">You&apos;re in the top 5% of students this week!</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-mono">PENDING TASKS</p>
                    <p className="text-2xl font-bold">4</p>
                </div>
            </div>
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span>Python Assignment (Due Tmrw)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Study for Math</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Recent Activity / Feed */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-mono">Recent Activity</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">🎓</div>
                    <div>
                        <p className="font-medium">Dr. Sarah Connor posted in <span className="text-emerald-400">Announcements</span></p>
                        <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-slate-300">Don&apos;t forget that the mid-term exam schedule has been updated. Please check the resources tab for the new timetable.</p>
                </div>
            </div>

             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">👤</div>
                    <div>
                        <p className="font-medium">John Smith replied to your question</p>
                        <p className="text-xs text-slate-500">5 hours ago</p>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-slate-300">&quot;You can use the useEffect hook to handle side effects in React...&quot;</p>
                    <Button variant="link" className="px-0 text-emerald-400">View Discussion</Button>
                </div>
            </div>
        </div>

        {/* Right Col: Quick Tools */}
        <div className="space-y-6">
             <h2 className="text-xl font-bold font-mono">Quick Access</h2>

             {/* Music Player Widget Placeholder */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                        <span>🎧</span> Focus Radio
                    </h3>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {/* Placeholder for iframe */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                        [Lo-Fi Player Loading...]
                    </div>
                    <iframe
                        className="w-full h-full absolute inset-0"
                        src="https://www.youtube.com/embed/jfKfPfyJRdk?controls=0&autoplay=0"
                        title="Lofi Radio"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
             </div>

             {/* Study Countdown */}
             <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="font-medium mb-3">Next Deadline</h3>
                <div className="text-center py-4">
                    <p className="text-3xl font-mono font-bold text-white">14:02:45</p>
                    <p className="text-xs text-indigo-300 mt-1">until Python Assignment locks</p>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500">Submit Now</Button>
             </div>
        </div>
      </div>
    </div>
  );
}
