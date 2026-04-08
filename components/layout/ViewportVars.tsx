'use client'

import { useEffect } from 'react'

function getVisualViewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight
}

export default function ViewportVars() {
  useEffect(() => {
    const root = document.documentElement

    const update = () => {
      // Keep a CSS length in px so layout can match the visible viewport when
      // browser UI or the virtual keyboard changes the visual viewport.
      root.style.setProperty('--vvh', `${Math.round(getVisualViewportHeight())}px`)
    }

    update()

    const vv = window.visualViewport
    window.addEventListener('resize', update)
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)

    return () => {
      window.removeEventListener('resize', update)
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
    }
  }, [])

  return null
}

