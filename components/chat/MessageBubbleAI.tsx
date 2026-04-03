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

export default function MessageBubbleAI({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start" style={{ gap: '10px', maxWidth: '88%' }}>
      {/* Avatar "N." — TT Trailers Black, anchors to top of first line */}
      <div
        className="shrink-0"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '22px',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--color-black)',
          paddingTop: '1px',
          minWidth: '28px',
        }}
        aria-hidden="true"
      >
        N.
      </div>

      {/* Message text */}
      <div
        style={{
          fontFamily: 'var(--font-text)',
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'var(--color-black)',
        }}
      >
        {renderContent(message.content)}
      </div>
    </div>
  )
}
