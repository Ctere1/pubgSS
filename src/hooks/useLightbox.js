import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Open/close state for a gallery lightbox, including handing focus back to the
 * thumbnail that opened it.
 *
 * Register each thumbnail with `setTrigger(index, el)` so the focus return has
 * something to aim at.
 */
export function useLightbox(items) {
  const [openIndex, setOpenIndex] = useState(null)
  const triggers = useRef([])

  // Drop stale trigger refs if the gallery shrinks.
  useEffect(() => {
    triggers.current.length = items.length
  }, [items.length])

  const setTrigger = useCallback((index, el) => {
    triggers.current[index] = el
  }, [])

  const open = useCallback((index) => setOpenIndex(index), [])

  const close = useCallback(() => {
    const trigger = triggers.current[openIndex]
    setOpenIndex(null)
    trigger?.focus()
  }, [openIndex])

  return {
    item: openIndex === null ? null : items[openIndex],
    open,
    close,
    setTrigger,
  }
}
