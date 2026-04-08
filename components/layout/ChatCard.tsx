export default function ChatCard({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div
      className="w-full flex flex-col min-h-0 chat-card"
      style={{
        maxWidth: '960px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '48px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}
