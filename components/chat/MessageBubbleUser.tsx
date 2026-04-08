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
        className="chat-body-text"
        style={{
          maxWidth: 'var(--bubble-user-max-width, 72%)',
          backgroundColor: bubbleColors[colorIndex % bubbleColors.length],
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          fontFamily: 'var(--font-text)',
          fontSize: 'clamp(15px, 3.8vw, 18px)',
          lineHeight: '1.45',
          color: 'var(--color-black)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}
