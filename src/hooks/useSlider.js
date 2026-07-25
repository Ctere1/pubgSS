import { useCallback, useEffect, useState } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Index state for a looping slider, plus the timer that advances it.
 *
 * The timer is a chained timeout rather than an interval so every manual move
 * (arrow, dot, swipe) restarts the full delay instead of landing on a stale
 * tick. It stands still while `paused` is true (the slider passes hover, focus,
 * dragging and an open lightbox) and never starts at all when the visitor asked
 * for reduced motion or the tab is in the background.
 */
export function useSlider(count, { delay = 5000, paused = false } = {}) {
  const [index, setIndex] = useState(0)
  const [awake, setAwake] = useState(true)

  const goTo = useCallback((next) => setIndex(((next % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  // A background tab throttles timers anyway; stopping outright means the
  // visitor comes back to the slide they left rather than a random one.
  useEffect(() => {
    const sync = () => setAwake(document.visibilityState === 'visible')
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    if (paused || !awake || count < 2) return
    if (window.matchMedia?.(REDUCED_MOTION).matches) return

    const id = setTimeout(next, delay)
    return () => clearTimeout(id)
  }, [index, paused, awake, count, delay, next])

  return { index, goTo, next, prev }
}
