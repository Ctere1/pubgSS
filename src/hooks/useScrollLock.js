import { useEffect } from 'react'

/**
 * Freezes page scroll while the caller is mounted, for dialogs.
 *
 * Hiding the overflow also takes the scrollbar away, which widens the viewport
 * and slides the whole page sideways. Padding the body by exactly the width the
 * scrollbar occupied keeps everything still. Overlay scrollbars (macOS, phones)
 * measure zero, so there the padding never appears.
 */
export function useScrollLock() {
  useEffect(() => {
    const { style } = document.body
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = style.overflow
    const previousPadding = style.paddingRight

    style.overflow = 'hidden'
    if (scrollbar > 0) style.paddingRight = `${scrollbar}px`

    return () => {
      style.overflow = previousOverflow
      style.paddingRight = previousPadding
    }
  }, [])
}
