
import prisma from "@/lib/db"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessageSquare, Send } from 'lucide-react'
import { auth } from "@/auth"

async function getForum(id: string) {
  return await prisma.forum.findUnique({
    where: { id },
    include: {
        posts: {
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                _count: {
                    select: { comments: true }
                }
            }
        }
    }
  })
}

// Mock action for posting
async function createPost(formData: FormData) {
    'use server'
    // Implementation would go here
    console.log("Creating post...")
}

export default async function ForumDetailPage({ params }: { params: { forumId: string } }) {
  // Await params for Next.js 15+ compatibility
  const { forumId } = await Promise.resolve(params);
  const forum = await getForum(forumId)
  const session = await auth()

  if (!forum) {
    return <div>Forum not found</div>
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/forums">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-mono text-white">{forum.name}</h1>
                    <p className="text-slate-400 text-sm">{forum.description}</p>
                </div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-500">New Topic</Button>
       </div>

       <div className="space-y-4">
            {forum.posts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500">
                    No discussions yet. Be the first to post!
                </div>
            ) : (
                forum.posts.map((post) => (
                    <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                                {post.author.name ? post.author.name[0] : '?'}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-100 mb-1">{post.title}</h3>
                                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{post.content}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span>by {post.author.name}</span>
                                    <span>•</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1 text-emerald-500 ml-auto">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{post._count.comments} replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
       </div>
    </div>
  )
}
