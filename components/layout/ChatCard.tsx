export default function ChatCard({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: '960px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '48px',
        height: 'calc(100vh - 260px)',
        minHeight: '400px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
