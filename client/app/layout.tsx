import type React from "react"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/auth-provider"
import Header from "@/components/header"

const poppins = Poppins({ weight: ["400", "700", '800'], subsets: ["latin"] })

export const metadata = {
  title: "TaskMaster",
  description: "A simple task management application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1 container mx-auto py-6 px-4">{children}</div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'