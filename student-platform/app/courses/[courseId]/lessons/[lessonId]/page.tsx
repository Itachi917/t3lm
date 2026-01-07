
import prisma from "@/lib/db"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

async function getLesson(id: string) {
  return await prisma.lesson.findUnique({
    where: { id },
    include: {
        chapter: {
            include: {
                course: true
            }
        }
    }
  })
}

import { auth } from "@/auth"

// Simple server action to mark completion (in a real app, this would use a proper action)
async function markComplete(lessonId: string) {
  'use server'
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.userProgress.upsert({
    where: {
        userId_lessonId: {
            userId: session.user.id,
            lessonId: lessonId
        }
    },
    update: { completed: true, completedAt: new Date() },
    create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: true,
        completedAt: new Date()
    }
  });

  // Award points (Mock logic - ideally trigger an event)
  await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: 50 }, xp: { increment: 50 } }
  })
}

export default async function LessonPage({ params }: { params: { courseId: string, lessonId: string } }) {
  const { courseId, lessonId } = await Promise.resolve(params);
  const lesson = await getLesson(lessonId)

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="h-full flex flex-col">
       <div className="mb-6 flex items-center justify-between">
            <Link href={`/courses/${courseId}`}>
                <Button variant="ghost" className="pl-0 text-slate-400 hover:text-white">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Course
                </Button>
            </Link>
            <h1 className="text-lg font-medium text-slate-200">{lesson.chapter.course.title} / {lesson.chapter.title}</h1>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col">
            {/* Video Player / Content Area */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
                {lesson.type === 'VIDEO' ? (
                     <iframe
                        className="w-full h-full aspect-video"
                        src={lesson.content}
                        title={lesson.title}
                        allowFullScreen
                     ></iframe>
                ) : (
                    <div className="p-8 max-w-3xl w-full mx-auto prose prose-invert">
                        <h1>{lesson.title}</h1>
                        <div className="whitespace-pre-wrap font-mono text-sm bg-slate-950 p-6 rounded-lg border border-slate-800">
                            {lesson.content}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                </div>
                <form action={async () => {
                    'use server'
                    await markComplete(lessonId)
                }}>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                    </Button>
                </form>
            </div>
       </div>
    </div>
  )
}
