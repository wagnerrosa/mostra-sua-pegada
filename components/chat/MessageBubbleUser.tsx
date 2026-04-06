import type { ChatMessage } from '@/types/chat'

export default function MessageBubbleUser({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div
        style={{
          maxWidth: '72%',
          backgroundColor: 'var(--color-bg)',
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
