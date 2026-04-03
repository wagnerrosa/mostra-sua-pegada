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
      {/* Background perspective grid — exclusion blend, 2300px wide, bottom-anchored */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/img_grade_bg.webp')",
          backgroundSize: '2300px auto',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.22,
        }}
        aria-hidden="true"
      />

      {/* Page layout */}
      <div
        className="relative flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        {/* Constrained content column */}
        <div
          className="flex flex-col flex-1 mx-auto w-full"
          style={{ maxWidth: '800px', padding: '24px 24px 0' }}
        >
          <Header />
          <main className="flex flex-1 items-center justify-center" style={{ paddingTop: '16px', paddingBottom: '0' }}>
            <ChatCard>
              <ChatShell />
            </ChatCard>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
