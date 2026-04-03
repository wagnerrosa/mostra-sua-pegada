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
      className="flex flex-wrap gap-2"
      style={{ padding: '8px 24px' }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          style={{
            backgroundColor: intentColors[option.intent],
            color: 'var(--color-black)',
            fontFamily: 'var(--font-text)',
            fontSize: '13px',
            lineHeight: '1.4',
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
