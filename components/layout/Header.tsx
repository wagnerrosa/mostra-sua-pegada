export default function Header() {
  return (
    <header className="flex items-baseline justify-between">
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '28px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
        }}
      >
        Nude.
      </span>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '18px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
        }}
      >
        #MostraSuaPegada
      </span>
    </header>
  )
}
