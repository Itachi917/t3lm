
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Users } from 'lucide-react';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                setIsActive(false);
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'FOCUS' | 'BREAK') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Timer Section */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-slate-900"></div>

        <div className="z-10 text-center space-y-8">
            <div className="flex gap-2 justify-center mb-8">
                <Button
                    variant={mode === 'FOCUS' ? 'default' : 'ghost'}
                    onClick={() => switchMode('FOCUS')}
                    className={mode === 'FOCUS' ? 'bg-emerald-600 hover:bg-emerald-500' : 'text-slate-400'}
                >
                    Focus (25m)
                </Button>
                <Button
                    variant={mode === 'BREAK' ? 'default' : 'ghost'}
                    onClick={() => switchMode('BREAK')}
                    className={mode === 'BREAK' ? 'bg-blue-600 hover:bg-blue-500' : 'text-slate-400'}
                >
                    Break (5m)
                </Button>
            </div>

            <div className="text-9xl font-mono font-bold text-white tabular-nums tracking-tighter">
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={toggleTimer} className="w-32 bg-white text-slate-900 hover:bg-slate-200">
                    {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button size="icon" variant="outline" onClick={resetTimer} className="border-slate-700 hover:bg-slate-800 text-white">
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>

            <p className="text-slate-500 animate-pulse mt-8">
                {isActive ? "Stay focused. You got this." : "Ready to start?"}
            </p>
        </div>
      </div>

      {/* Sidebar: Online Users & Todo */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-400" />
                Live Study Room
            </h3>
            <div className="space-y-4">
                {[1,2,3,4,5].map((n, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-300">Student {n * 123}</p>
                            <p className="text-xs text-slate-500">Studying Python</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
