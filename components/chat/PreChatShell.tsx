'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { QuickReplyOption } from '@/types/chat'

// ─── Icons (same as ChatComposer) ────────────────────────────────────────────

function IconSend({ active }: { active?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={active ? '/btn/send-active.svg' : '/btn/send-idle.svg'}
      width={65} height={65}
      alt=""
      aria-hidden="true"
    />
  )
}

// ─── Static quick reply options ───────────────────────────────────────────────

const PRE_CHAT_QUICK_REPLIES: QuickReplyOption[] = [
  { id: 'register', label: 'Cadastrar minha empresa', value: 'register', intent: 'confirm' },
  { id: 'how', label: 'Como funciona?', value: 'how', intent: 'action' },
  { id: 'existing', label: 'Já tenho cadastro', value: 'existing', intent: 'neutral' },
]

const intentColors: Record<string, string> = {
  confirm: 'var(--color-green)',
  action: 'var(--color-purple)',
  neutral: 'var(--color-blue)',
  reject: 'var(--color-orange)',
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PreChatShellProps {
  onSendText: (text: string) => void
  onSelectQuickReply: (option: QuickReplyOption) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreChatShell({ onSendText, onSelectQuickReply }: PreChatShellProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSendText(trimmed)
    setText('')
  }, [text, onSendText])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const canSend = text.trim().length > 0

  return (
    <div
      className="flex flex-col justify-between"
      style={{ height: '100%', padding: '0' }}
    >
      {/* ── Headline area ── */}
      <div
        className="flex flex-col justify-center flex-1 pre-chat-content"
        style={{ padding: '40px 48px 24px' }}
      >
        <h1
          className="pre-chat-headline"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(32px, 5vw, 70px)',
            lineHeight: '1.05',
            color: 'var(--color-black)',
            margin: '0 0 16px',
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
            margin: 0,
          }}
        >
          Cadastre-se e exiba o selo de transparência climática da Nude.
        </p>
      </div>

      {/* ── Quick replies ── */}
      <div
        className="flex flex-wrap gap-2 pre-chat-qr"
        style={{ padding: '0 24px 12px 24px' }}
        role="group"
        aria-label="Opções rápidas"
      >
        {PRE_CHAT_QUICK_REPLIES.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectQuickReply(option)}
            style={{
              backgroundColor: intentColors[option.intent] ?? 'var(--color-blue)',
              color: '#ffffff',
              fontFamily: 'var(--font-text)',
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: '1.4',
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* ── Input pill ── */}
      <div
        className="composer-wrapper"
        style={{ borderTop: 'none', padding: '10px 24px 16px', backgroundColor: 'var(--color-surface)' }}
      >
        <div
          className="pill-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(239, 228, 206, 0.6)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '99px',
            padding: '14px 14px 14px 26px',
            minHeight: '77px',
            gap: '8px',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="composer-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua mensagem..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-text)',
              fontSize: '18px',
              lineHeight: '25px',
              color: 'var(--color-black)',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: canSend ? 'pointer' : 'default',
              display: 'flex',
              flexShrink: 0,
              opacity: canSend ? 1 : 0.45,
            }}
            aria-label="Enviar mensagem"
          >
            <IconSend active={canSend} />
          </button>
        </div>
      </div>
    </div>
  )
}
