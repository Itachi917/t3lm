import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, ArrowRight, LogIn } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004D98] relative overflow-hidden">
      
      {/* Background Decor (Matches Sign Up Page) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#A50044] rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EDBB00] rounded-full blur-[100px] opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-sm p-8 relative z-10">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#A50044] text-[#EDBB00] mb-4 shadow-lg border-2 border-[#EDBB00]">
                <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                T3LM<span className="text-[#EDBB00]">.APP</span>
            </h1>
            <p className="text-slate-300 mt-2 font-medium">Student Portal Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
            <form
              action={async (formData) => {
                "use server"
                await signIn("credentials", formData)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-[#EDBB00] mb-1 ml-1">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="student@university.edu"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EDBB00] transition-all"
                    required
                />
              </div>
              
              <div>
                 <label className="block text-xs font-bold uppercase text-[#EDBB00] mb-1 ml-1">Password</label>
                 <input
                    name="password"
                    type="password"
                    placeholder="••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EDBB00] transition-all"
                    required
                 />
              </div>

              <Button className="w-full bg-[#EDBB00] hover:bg-white text-[#004D98] hover:text-[#A50044] font-black uppercase tracking-widest py-6 text-lg shadow-lg transition-all duration-300 mt-2">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </form>

            {/* Link to Sign Up */}
            <div className="mt-6 text-center border-t border-white/10 pt-6">
                <p className="text-slate-400 text-sm">
                  New student?{" "}
                  <Link href="/signup" className="text-[#EDBB00] hover:text-white font-bold uppercase transition-colors inline-flex items-center gap-1">
                    Create Account <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
