export default function ChatCard({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: '720px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        height: 'calc(100vh - 160px)',
        minHeight: '400px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
