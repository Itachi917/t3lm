
import prisma from "@/lib/db"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"

async function getStaff() {
  return await prisma.staff.findMany()
}

export default async function StaffPage() {
  const staffMembers = await getStaff()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold font-mono text-white">Faculty Staff</h1>
            <p className="text-slate-400">Find professors, TAs, and office hours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => (
             <div key={staff.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors">
                <div className="flex p-6 gap-4">
                    <img
                        src={staff.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`}
                        alt={staff.name}
                        className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700"
                    />
                    <div>
                        <h3 className="font-bold text-white text-lg">{staff.name}</h3>
                        <span className="inline-block bg-slate-800 text-emerald-400 text-xs px-2 py-1 rounded mb-2 font-mono">{staff.role}</span>
                    </div>
                </div>

                <div className="px-6 pb-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{staff.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{staff.timetable}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="truncate">{staff.email}</span>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white" variant="outline">
                        Book Appointment
                    </Button>
                </div>
             </div>
        ))}
      </div>
    </div>
  )
}
