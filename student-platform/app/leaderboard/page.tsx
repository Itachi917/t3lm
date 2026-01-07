
import prisma from "@/lib/db"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award } from 'lucide-react'

async function getLeaderboard() {
  // In a real app, this would be sorted by points desc
  // prisma v5 sort syntax:
  return await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 10,
    include: {
        achievements: true
    }
  })
}

export default async function LeaderboardPage() {
  const users = await getLeaderboard()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-mono text-emerald-400">Hall of Fame</h1>
        <p className="text-slate-400">Top performing students this semester.</p>
      </div>

      <div className="grid gap-4">
        {users.map((user, index) => (
            <div
                key={user.id}
                className={`
                    relative flex items-center p-4 rounded-xl border transition-all
                    ${index === 0 ? 'bg-amber-500/10 border-amber-500/50' :
                      index === 1 ? 'bg-slate-400/10 border-slate-400/50' :
                      index === 2 ? 'bg-orange-700/10 border-orange-700/50' : 'bg-slate-900 border-slate-800'}
                `}
            >
                {/* Rank Badge */}
                <div className="w-12 flex justify-center font-mono font-bold text-xl">
                    {index === 0 && <Trophy className="w-8 h-8 text-amber-500" />}
                    {index === 1 && <Medal className="w-8 h-8 text-slate-400" />}
                    {index === 2 && <Medal className="w-8 h-8 text-orange-700" />}
                    {index > 2 && <span className="text-slate-500">#{index + 1}</span>}
                </div>

                {/* Avatar */}
                <div className="mx-4">
                    <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name || "User"} className="w-12 h-12 rounded-full bg-slate-800" />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">LEVEL {user.level} • {user.role}</p>
                </div>

                {/* Points */}
                <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400 font-mono">{user.points}</p>
                    <p className="text-xs text-emerald-500/70">XP</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
