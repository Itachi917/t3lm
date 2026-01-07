
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "CyberLearn - IT Student Portal",
  description: "The ultimate learning platform for IT students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
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
