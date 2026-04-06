import type { ChatMessage } from '@/types/chat'

const bubbleColors = [
  'var(--color-green)',
  'var(--color-blue)',
  'var(--color-orange)',
  'var(--color-purple)',
]

export default function MessageBubbleUser({ message, colorIndex = 0 }: { message: ChatMessage; colorIndex?: number }) {
  return (
    <div className="flex justify-end">
      <div
        style={{
          maxWidth: '72%',
          backgroundColor: bubbleColors[colorIndex % bubbleColors.length],
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          fontFamily: 'var(--font-text)',
          fontSize: '18px',
          lineHeight: '25px',
          color: 'var(--color-black)',
          maxHeight: '200px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}
