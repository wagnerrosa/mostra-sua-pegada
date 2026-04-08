import type { Metadata, Viewport } from 'next'
import './globals.css'
import ViewportVars from '@/components/layout/ViewportVars'

export const metadata: Metadata = {
  title: 'Mostra Sua Pegada — Nude.',
  description: 'Cadastre sua empresa no movimento Mostra Sua Pegada.',
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ViewportVars />
        {children}
      </body>
    </html>
  )
}
