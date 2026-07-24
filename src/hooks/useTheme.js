import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pubgss-theme-preference'
const META_COLOR = { light: '#ffffff', dark: '#0b0f14' }

function read() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage unavailable (private mode) — fall through to system */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Light/dark theme with a single toggle. Mirrors the inline script in
 * index.html — both use the same storage key so there is no flash on load.
 * Until the user picks a theme, the system preference is followed live.
 */
export function useTheme() {
  const [theme, setTheme] = useState(read)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document
      .getElementById('theme-color-meta')
      ?.setAttribute('content', META_COLOR[theme])
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      let stored = null
      try {
        stored = localStorage.getItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      if (!stored) setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
