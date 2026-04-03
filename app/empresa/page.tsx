import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatCard from '@/components/layout/ChatCard'
import ChatShell from '@/components/chat/ChatShell'

export default function EmpresaPage() {
  return (
    <div
      className="relative"
      style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}
    >
      {/* Background perspective grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/img_grade_bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Page layout */}
      <div
        className="relative flex flex-col"
        style={{ minHeight: '100vh', padding: '24px 16px' }}
      >
        <Header />
        <main className="flex flex-1 items-center justify-center" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
          <ChatCard>
            <ChatShell />
          </ChatCard>
        </main>
        <Footer />
      </div>
    </div>
  )
}
