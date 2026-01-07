
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, FileText } from 'lucide-react'

async function getResources() {
  return await prisma.sharedResource.findMany({
    where: { isPublic: true },
    include: { author: true }
  })
}

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-mono text-white">Resource Library</h1>
            <p className="text-slate-400">Curated cheat sheets, guides, and tools.</p>
        </div>
        <Button className="bg-slate-800 border border-slate-700 hover:bg-slate-700">Contribute Resource</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Citation Generator Card (Static Tool) */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Citation Generator</h3>
            <p className="text-indigo-200 text-sm mb-4">Auto-generate APA, MLA, and Chicago citations for your papers.</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500">Open Tool</Button>
        </div>

        {resources.map((res) => (
            <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400">{res.type}</span>
                        <span className="text-xs text-slate-500">by {res.author.name}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{res.title}</h3>
                    <div className="text-slate-400 text-sm line-clamp-3 mb-4 font-mono text-xs bg-slate-950 p-2 rounded border border-slate-900">
                        {res.content.substring(0, 100)}...
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-slate-900 border-slate-700">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
