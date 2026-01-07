
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { MessageCircle, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

async function getForums() {
  return await prisma.forum.findMany({
    include: {
      _count: {
        select: { posts: true }
      },
      posts: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
            author: true
        }
      }
    }
  })
}

export default async function ForumsPage() {
  const forums = await getForums()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-mono text-white">Study Groups</h1>
            <p className="text-slate-400">Join the discussion and learn together.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-500">Create New Group</Button>
      </div>

      <div className="grid gap-4">
        {forums.map((forum) => (
            <div key={forum.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-800 rounded-lg text-emerald-400">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <Link href={`/forums/${forum.id}`} className="text-xl font-bold text-slate-100 hover:text-emerald-400 transition-colors">
                                {forum.name}
                            </Link>
                            <p className="text-slate-400 mt-1">{forum.description}</p>

                            {forum.posts[0] && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 bg-slate-950/50 p-2 rounded">
                                    <span className="text-emerald-500">Latest:</span>
                                    <span className="truncate max-w-md">&quot;{forum.posts[0].title}&quot;</span>
                                    <span className="text-slate-600">• by {forum.posts[0].author.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center px-4 border-l border-slate-800 hidden md:block">
                        <p className="text-2xl font-bold text-white">{forum._count.posts}</p>
                        <p className="text-xs text-slate-500 uppercase">Topics</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
