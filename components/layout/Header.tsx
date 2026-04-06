'use client'

import { useState } from 'react'

export default function Header() {
  const [isAnimating, setIsAnimating] = useState(false)

  const playLogoAnimation = () => {
    setIsAnimating(false)
    requestAnimationFrame(() => setIsAnimating(true))
    window.setTimeout(() => {
      setIsAnimating(false)
    }, 360)
  }

  return (
    <header className="flex items-start justify-between" role="banner">
      <button
        type="button"
        className="header-logo"
        onClick={playLogoAnimation}
        style={{
          appearance: 'none',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '64px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: 'var(--color-black)',
          marginLeft: '-25px',
          display: 'inline-block',
        }}
      >
        <span className={isAnimating ? 'header-logo-bounce' : undefined}>
          Nude.
        </span>
        <span className="sr-only">Nude.</span>
      </button>
    </header>
  )
}
