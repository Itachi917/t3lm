
import prisma from "@/lib/db"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText } from 'lucide-react'

async function getCourses(category?: string) {
  const where = category ? { category: { contains: category } } : {}

  return await prisma.course.findMany({
    where,
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  })
}

export default async function CoursesPage({ searchParams }: { searchParams: { category?: string } }) {
  const { category } = await Promise.resolve(searchParams);
  const courses = await getCourses(category)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-mono text-white">All Courses</h1>
            <p className="text-slate-400">Explore the curriculum and start learning.</p>
        </div>
        {/* Filter Buttons */}
        <div className="flex gap-2">
            <Link href="/courses">
                <Button variant={!category ? "outline" : "ghost"} size="sm" className={!category ? "bg-slate-900 border-slate-700" : "text-slate-400"}>All</Button>
            </Link>
            <Link href="/courses?category=Programming">
                <Button variant={category === 'Programming' ? "outline" : "ghost"} size="sm" className={category === 'Programming' ? "bg-slate-900 border-slate-700" : "text-slate-400"}>Programming</Button>
            </Link>
            <Link href="/courses?category=Web">
                <Button variant={category === 'Web' ? "outline" : "ghost"} size="sm" className={category === 'Web' ? "bg-slate-900 border-slate-700" : "text-slate-400"}>Web</Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id} className="group">
            <Card className="h-full bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20">
              <div className="aspect-video relative bg-slate-800 overflow-hidden rounded-t-xl">
                 {/* Fallback image if thumbnail is invalid/missing */}
                 <img
                    src={course.thumbnail || "https://placehold.co/600x400/1e293b/FFF?text=Course"}
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                        {course.category}
                    </Badge>
                 </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {course.title}
                </CardTitle>
                <CardDescription className="text-slate-400 line-clamp-2">
                    {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <PlayCircle className="w-4 h-4" />
                        <span>{course._count.chapters} Chapters</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Notes Included</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
