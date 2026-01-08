import Link from 'next/link';
import { Home, BookOpen, Users, Award, Briefcase, Settings, LogOut, MessageCircle, Clock, LogIn, GraduationCap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { auth, signOut } from "@/auth";

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Community', href: '/forums', icon: MessageCircle },
  { name: 'Leaderboard', href: '/leaderboard', icon: Award },
  { name: 'Resources', href: '/resources', icon: Briefcase },
  { name: 'Focus Room', href: '/focus', icon: Clock },
  { name: 'My Timetable', href: '/timetable', icon: Calendar },
];

export async function Sidebar({ className }: { className?: string }) {
  const session = await auth();

  return (
    <div className={cn("flex flex-col h-screen w-64 bg-[#004D98] text-white border-r border-[#A50044]", className)}>
      <div className="p-6 border-b border-[#A50044]">
        <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-[#EDBB00]" />
            <div>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-[#EDBB00]">
                T3LM<span className="text-white">.APP</span>
                </h1>
                <p className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Student Platform</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wide rounded-none hover:bg-[#A50044] hover:text-[#EDBB00] transition-all duration-300 clip-path-slant"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#A50044] bg-[#003870] space-y-4">
        {/* Static Widget - You can update this later to be dynamic too if you want */}
        <div className="bg-[#A50044] p-4 rounded-lg text-center border border-[#EDBB00]">
            <p className="text-xs font-bold text-[#EDBB00] uppercase mb-1">Next Class</p>
            <p className="text-2xl font-black text-white font-mono">14:00</p>
            <p className="text-[10px] text-white/80">PYTHON 101</p>
        </div>

        {session ? (
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#A50044] hover:text-[#EDBB00] uppercase font-bold">
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </Button>
            </form>
        ) : (
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start text-[#EDBB00] hover:bg-[#A50044] hover:text-white uppercase font-bold">
                <LogIn className="w-5 h-5 mr-3" />
                Sign In
              </Button>
            </Link>
        )}
      </div>
    </div>
  );
}
