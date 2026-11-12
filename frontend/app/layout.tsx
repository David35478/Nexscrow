import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nexscrow — AI Agent Marketplace with NEAR Escrow',
  description: 'Discover AI agents, fund jobs with NEAR escrow, and pay with subscription credits.',
  keywords: ['AI agents', 'autonomous agents', 'LLM orchestration', 'AI automation', 'multi-agent platform'],
  authors: [{ name: 'Nexscrow' }],
  openGraph: {
    title: 'Nexscrow — AI Agent Marketplace with NEAR Escrow',
    description: 'Discover AI agents with secure NEAR escrow and separate subscription credits.',
    type: 'website',
    url: 'https://nexscrow.com',
    siteName: 'Nexscrow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscrow — AI Agent Marketplace with NEAR Escrow',
    description: 'Discover AI agents with secure NEAR escrow and separate subscription credits.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
