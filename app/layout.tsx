import type { Metadata, Viewport } from 'next'
import './globals.css'
import ViewportVars from '@/components/layout/ViewportVars'

const title = 'Cadastro via IA | Mostra Sua Pegada'
const description =
  'Onboarding de empresas via interface conversacional: registre sua empresa no programa Mostra Sua Pegada com uma experiência simples e guiada.'

export const metadata: Metadata = {
  title,
  description,
  robots: 'index, follow',
  openGraph: {
    title,
    description,
    type: 'website',
    images: [
      {
        url: '/favico/logo-circle.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/favico/logo-circle.png'],
  },
  icons: {
    icon: '/favico/logo-circle.png',
  },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
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
