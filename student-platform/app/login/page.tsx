
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm p-8 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold font-mono text-emerald-400">CyberLearn</h1>
            <p className="text-slate-400 mt-2">Sign in to continue</p>
        </div>

        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
                name="email"
                type="email"
                placeholder="student@university.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white focus:border-emerald-500 outline-none transition-colors"
                required
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Password</label>
             <input
                name="password"
                type="password"
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white focus:border-emerald-500 outline-none transition-colors"
                required
             />
          </div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
            Use <span className="text-emerald-500">student@university.edu</span> / <span className="text-emerald-500">password123</span>
        </div>
      </div>
    </div>
  )
}
