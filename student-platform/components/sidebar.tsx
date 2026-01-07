
import Link from 'next/link';
import { Home, BookOpen, Users, Award, Briefcase, Settings, LogOut, MessageCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Study Groups', href: '/forums', icon: MessageCircle },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Leaderboard', href: '/leaderboard', icon: Award },
  { name: 'Resources', href: '/resources', icon: Briefcase },
  { name: 'Focus Room', href: '/focus', icon: Clock },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-100", className)}>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          CyberLearn
        </h1>
        <p className="text-xs text-slate-500 mt-1">IT Faculty Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors group"
          >
            <item.icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-slate-400">NEXT BREAK</span>
                <span className="text-xs font-mono text-emerald-400">15:00</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-1.5 rounded-full w-2/3"></div>
            </div>
        </div>
        <Link href="/profile">
             <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
                <Settings className="w-5 h-5 mr-3" />
                Settings
            </Button>
        </Link>
      </div>
    </div>
  );
}
