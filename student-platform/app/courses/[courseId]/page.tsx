
import prisma from "@/lib/db"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, CheckCircle, ChevronLeft } from 'lucide-react'

async function getCourse(id: string) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        include: {
          lessons: true
        },
        orderBy: { order: 'asc' }
      }
    }
  })
}

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courseId } = await Promise.resolve(params);
  const course = await getCourse(courseId)

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="space-y-8">
       {/* Breadcrumb / Back */}
       <div>
            <Link href="/courses">
                <Button variant="ghost" className="pl-0 text-slate-400 hover:text-white">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to All Courses
                </Button>
            </Link>
       </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="h-48 md:h-64 bg-slate-800 relative">
            <img
                src={course.thumbnail || ""}
                alt={course.title}
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
                <p className="text-lg text-slate-300 max-w-2xl">{course.description}</p>
            </div>
        </div>

        <div className="p-8">
            <h2 className="text-xl font-bold font-mono mb-6 text-emerald-400">Course Content</h2>
            <div className="space-y-6">
                {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
                        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                             <h3 className="font-medium text-slate-200">Chapter {chapter.order}: {chapter.title}</h3>
                             <span className="text-xs text-slate-500 font-mono">{chapter.lessons.length} LESSONS</span>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {chapter.lessons.map((lesson) => (
                                <Link
                                    key={lesson.id}
                                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {lesson.type === 'VIDEO' ? (
                                            <PlayCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        )}
                                        <span className="text-slate-300 group-hover:text-white transition-colors">
                                            {lesson.order}. {lesson.title}
                                        </span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" variant="secondary">Start</Button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
