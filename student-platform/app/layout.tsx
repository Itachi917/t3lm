import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";
import { auth } from "@/auth"; // Import auth to get the session

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
  // 1. Fetch the session on the server
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
            <div className="min-h-screen relative">
              
              {/* 2. Pass session to Sidebar so it knows if user is logged in */}
              <Sidebar userSession={session} />
              
              {/* 3. Main Content Wrapper 
                 - md:ml-64: Pushes content right on desktop to make room for sidebar
                 - pt-20: Pushes content down on mobile to clear the new header
              */}
              <main className="md:ml-64 pt-20 md:pt-0 min-h-screen p-4 md:p-8 transition-all duration-300">
                {children}
              </main>

              <ChatWidget />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
