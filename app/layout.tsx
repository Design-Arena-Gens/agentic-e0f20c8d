import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diet Coach AI - आपका Personal Nutrition Guide',
  description: 'Weight loss aur healthy lifestyle ke liye AI-powered diet coach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  )
}
