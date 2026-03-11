import './globals.css'
import TopBar from '@/components/TopBar'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Youth Connection Hub',
  description: 'A static community hub for youth connections.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <TopBar />
        {children}
      </body>
    </html>
  )
}
