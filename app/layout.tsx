import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mostra Sua Pegada — Nude.',
  description: 'Cadastre sua empresa no movimento Mostra Sua Pegada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
