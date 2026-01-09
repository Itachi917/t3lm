import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chat/chat-widget"; 
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "T3LM.APP - Student Portal",
  description: "The ultimate learning platform for students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, mono.variable, "bg-slate-950 font-sans antialiased text-slate-100")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Main Content Wrapper */}
            <div className="min-h-screen relative flex">
              
              <Sidebar userSession={session} />
              
              {/* Added w-full to ensure it takes width properly */}
              <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen p-4 md:p-8 transition-all duration-300 w-full">
                {children}
              </main>

            </div>

            {/* MOVED OUTSIDE THE MAIN DIV - This forces it to top layer */}
            <ChatWidget />

          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
