interface TypingIndicatorProps {
  showAvatar?: boolean
}

export default function TypingIndicator({ showAvatar = true }: TypingIndicatorProps) {
  return (
    <div className="flex items-start" style={{ gap: '12px', maxWidth: '90%' }}>
      {/* Avatar slot — same width as MessageBubbleAI for alignment */}
      <div
        className="shrink-0"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '28px',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--color-black)',
          minWidth: '34px',
          visibility: showAvatar ? 'visible' : 'hidden',
        }}
        aria-hidden="true"
      >
        N.
      </div>

      {/* Typing dots */}
      <div className="flex items-center gap-1" style={{ paddingTop: '10px' }}>
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
