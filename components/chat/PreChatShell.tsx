'use client'

import type { QuickReplyOption } from '@/types/chat'

// ─── Static quick reply options ───────────────────────────────────────────────

const PRE_CHAT_QUICK_REPLIES: QuickReplyOption[] = [
  { id: 'register', label: 'Cadastrar minha empresa', value: 'register', intent: 'confirm' },
  { id: 'supplier', label: 'Quero ser fornecedor', value: 'supplier', intent: 'neutral' },
]

const intentColors: Record<string, string> = {
  confirm: 'var(--color-green)',
  action: 'var(--color-purple)',
  neutral: 'var(--color-blue)',
  reject: 'var(--color-orange)',
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PreChatShellProps {
  onSelectQuickReply: (option: QuickReplyOption) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreChatShell({ onSelectQuickReply }: PreChatShellProps) {
  return (
    <div
      className="flex flex-1 min-h-0"
      style={{
        padding: '0',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <div
        className="flex flex-col pre-chat-content"
        style={{ padding: '40px 48px', width: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/eye.webp" alt="" aria-hidden="true" width={22} height={22} style={{ display: 'block' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/planta.webp" alt="" aria-hidden="true" width={18} height={18} style={{ display: 'block' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/eye.webp" alt="" aria-hidden="true" width={22} height={22} style={{ display: 'block' }} />
        </div>
        <h1
          className="pre-chat-headline"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(32px, 5vw, 70px)',
            lineHeight: '1.05',
            color: 'var(--color-black)',
            margin: '0 0 28px',
            maxWidth: '640px',
          }}
        >
          Mostre a pegada de carbono da sua empresa.
        </h1>
        <p
          className="pre-chat-subtitle"
          style={{
            fontFamily: 'var(--font-text)',
            fontSize: '16px',
            lineHeight: '1.5',
            color: 'var(--color-black)',
            opacity: 0.6,
            margin: '0 0 42px',
          }}
        >
          Cadastre-se e exiba o selo de transparência climática da Nude.
        </p>

        {/* ── Quick replies ── */}
        <div
          className="flex gap-3 pre-chat-qr"
          style={{
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}
          role="group"
          aria-label="Opções rápidas"
        >
          {PRE_CHAT_QUICK_REPLIES.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectQuickReply(option)}
              className="pre-chat-qr-btn"
              style={{
                backgroundColor: intentColors[option.intent] ?? 'var(--color-blue)',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 900,
                lineHeight: '1.4',
                padding: '14px 28px',
                borderRadius: '999px',
                border: '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'opacity 0.15s, transform 0.1s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
