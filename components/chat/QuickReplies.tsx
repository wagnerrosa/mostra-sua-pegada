import type { QuickReplyOption, QuickReplyIntent } from '@/types/chat'

const intentColors: Record<QuickReplyIntent, string> = {
  confirm: 'var(--color-green)',
  reject: 'var(--color-orange)',
  neutral: 'var(--color-blue)',
  action: 'var(--color-purple)',
}

interface QuickRepliesProps {
  options: QuickReplyOption[]
  onSelect: (option: QuickReplyOption) => void
}

export default function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  if (options.length === 0) return null

  return (
    <div
      className="flex flex-wrap gap-2 quick-replies-wrapper"
      style={{ padding: '6px 24px 2px' }}
      role="group"
      aria-label="Opções de resposta rápida"
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          aria-label={option.label}
          style={{
            backgroundColor: intentColors[option.intent],
            color: 'var(--color-black)',
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
  )
}
