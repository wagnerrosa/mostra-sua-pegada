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
          backgroundSize: '2600px auto',
          backgroundPosition: 'center bottom 85px',
          backgroundRepeat: 'no-repeat',
          opacity: 0.12,
          mixBlendMode: 'exclusion',
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
          className="flex flex-col flex-1 mx-auto w-full page-content"
          style={{ maxWidth: '1024px', padding: '32px 24px 0' }}
        >
          <Header />
          <main
            className="flex flex-1 items-center justify-center"
            style={{ paddingTop: '16px', paddingBottom: '0', position: 'relative' }}
            role="main"
            aria-label="Interface de cadastro Mostra Sua Pegada"
          >
            {/* ── Badge rotating — partially outside top-right of the card ── */}
            <div
              className="badge-rotating"
              style={{
                position: 'absolute',
                top: '-92px',
                right: '-92px',
                animation: 'spin 8s linear infinite',
                zIndex: 10,
                pointerEvents: 'none',
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/badge.webp"
                alt=""
                aria-hidden="true"
                width={220}
                height={220}
                style={{ display: 'block' }}
              />
            </div>
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
