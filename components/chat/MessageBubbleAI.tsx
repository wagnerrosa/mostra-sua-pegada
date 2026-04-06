'use client'

import { useEffect, useState } from 'react'
import type { ChatMessage } from '@/types/chat'

function renderContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const lines = part.split('\n')
    return lines.map((line, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </span>
    ))
  })
}

interface MessageBubbleAIProps {
  message: ChatMessage
  /** Show the "N." avatar — true only for the first message of each AI block */
  showAvatar?: boolean
}

export default function MessageBubbleAI({ message, showAvatar = true }: MessageBubbleAIProps) {
  const [animateAvatar, setAnimateAvatar] = useState(false)

  useEffect(() => {
    if (!showAvatar) return
    setAnimateAvatar(false)
    requestAnimationFrame(() => setAnimateAvatar(true))
    const timer = window.setTimeout(() => setAnimateAvatar(false), 360)
    return () => window.clearTimeout(timer)
  }, [message.id, showAvatar])

  return (
    <div className="flex items-start" style={{ gap: '12px', maxWidth: '90%' }}>
      {/* Avatar slot: always takes up space for alignment; only renders "N." when showAvatar */}
      <div
        className={`shrink-0${animateAvatar ? ' ai-avatar-bounce' : ''}`}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '36px',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--color-black)',
          minWidth: '34px',
          visibility: showAvatar ? 'visible' : 'hidden',
        }}
        aria-hidden="true"
      >
        N.
      </div>

      {/* Message text */}
      <div
        style={{
          fontFamily: 'var(--font-text)',
          fontSize: '18px',
          lineHeight: '25px',
          color: 'var(--color-black)',
          paddingTop: '5px',
        }}
      >
        {renderContent(message.content)}
      </div>
    </div>
  )
}
