import './globals.css'
import ClientLayout from './client-layout'
import { Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import 'leaflet/dist/leaflet.css'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Pathfinder',
  description: 'Fleet Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${poppins.variable}`}
    >
      <body className="bg-background min-h-screen font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  )
}
