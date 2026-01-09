"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, Award, Briefcase, Settings, LogOut, MessageCircle, Clock, LogIn, GraduationCap, Calendar, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from "next-auth/react" 
import { useLanguage } from '@/components/language-provider';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Sidebar({ className, userSession }: { className?: string, userSession?: any }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Define items INSIDE the component so they can use translations
  const navItems = [
    { name: t.dashboard, href: '/', icon: Home },
    { name: t.courses, href: '/courses', icon: BookOpen },
    { name: t.staff, href: '/staff', icon: Users },
    { name: t.community, href: '/forums', icon: MessageCircle },
    { name: t.leaderboard, href: '/leaderboard', icon: Award },
    { name: t.resources, href: '/resources', icon: Briefcase },
    { name: t.focusRoom, href: '/focus', icon: Clock },
    { name: t.timetable, href: '/timetable', icon: Calendar },
  ];

  // Auto-close sidebar when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#004D98] text-white border-r border-[#A50044]">
      {/* Header */}
      <div className="p-6 border-b border-[#A50044] flex justify-between items-center">
        <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-[#EDBB00]" />
            <div>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-[#EDBB00]">
                {t.title}
                </h1>
                <p className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">{t.subtitle}</p>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-white hover:text-[#EDBB00]">
            <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wide rounded-none transition-all duration-300 clip-path-slant",
                    isActive 
                        ? "bg-[#A50044] text-[#EDBB00] pl-6 border-l-4 border-[#EDBB00]" 
                        : "hover:bg-[#A50044] hover:text-[#EDBB00] text-slate-200"
                )}
            >
                <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-[#EDBB00]" : "text-slate-400")} />
                {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#A50044] bg-[#003870] space-y-4">
        
        {/* Language Switcher */}
        <div className="w-full flex justify-center pb-2">
            <LanguageSwitcher />
        </div>

        {/* Next Class Widget */}
        <div className="bg-[#A50044] p-4 rounded-lg text-center border border-[#EDBB00]">
            <p className="text-xs font-bold text-[#EDBB00] uppercase mb-1">Next Class</p>
            <p className="text-2xl font-black text-white font-mono">14:00</p>
            <p className="text-[10px] text-white/80">PYTHON 101</p>
        </div>

        {userSession ? (
             <Button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-[#A50044] hover:text-[#EDBB00] uppercase font-bold"
             >
                <LogOut className="w-5 h-5 mr-3" />
                {t.signOut}
            </Button>
        ) : (
            <Link href="/login" className="block w-full">
              <Button variant="ghost" className="w-full justify-start text-[#EDBB00] hover:bg-[#A50044] hover:text-white uppercase font-bold">
                <LogIn className="w-5 h-5 mr-3" />
                {t.signIn}
              </Button>
            </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TRIGGER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#004D98] p-4 flex items-center justify-between border-b border-[#EDBB00] shadow-md">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#EDBB00]" />
            <span className="font-black italic text-[#EDBB00]">{t.title}</span>
          </div>
          <Button onClick={() => setIsOpen(true)} size="icon" variant="ghost" className="text-white hover:bg-[#A50044]">
            <Menu className="w-6 h-6" />
          </Button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#004D98] transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className={cn("hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bottom-0", className)}>
        <SidebarContent />
      </div>
    </>
  );
}
