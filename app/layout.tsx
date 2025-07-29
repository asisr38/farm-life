import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kathmandu Valley Farm - Organic Farming in Nepal',
  description: 'Discover the most capital-efficient way to start organic farming in Kathmandu Valley. Learn about leasing strategies, financial planning, and sustainable agriculture in Nepal.',
  keywords: 'organic farming, Kathmandu Valley, Nepal, farm lease, sustainable agriculture, organic vegetables',
  authors: [{ name: 'Kathmandu Valley Farm Project' }],
  openGraph: {
    title: 'Kathmandu Valley Farm - Organic Farming in Nepal',
    description: 'Discover the most capital-efficient way to start organic farming in Kathmandu Valley.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 