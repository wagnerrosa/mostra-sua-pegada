export default function Header() {
  return (
    <header className="flex items-start justify-between" role="banner">
      <span
        className="header-logo"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '64px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
          marginLeft: '-25px',
        }}
      >
        Nude.
      </span>
    </header>
  )
}
