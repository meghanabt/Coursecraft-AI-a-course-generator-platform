import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import {cn} from '@/lib/utils'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/Providers'

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CourseCraft-AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        lexend.className, 'antialiased min-h-screen pt-16'
      )}>
        <ThemeProvider>
        <Navbar/>
        {children}
        </ThemeProvider>
        </body>
    </html>
  )
}
