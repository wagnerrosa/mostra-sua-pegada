export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" style={{ maxWidth: '85%' }}>
      {/* Avatar N. */}
      <div
        className="shrink-0"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '20px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
          paddingTop: '2px',
        }}
        aria-hidden="true"
      >
        N.
      </div>

      {/* Typing dots */}
      <div className="flex items-center gap-1" style={{ paddingTop: '6px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-border)',
              display: 'inline-block',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
