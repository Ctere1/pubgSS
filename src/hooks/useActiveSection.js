import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently under the header band, for
 * highlighting the matching nav link. Replaces the old scroll-offset maths
 * with a single IntersectionObserver.
 */
export function useActiveSection(ids, offset = 96) {
  // Null until a section reaches the band, so nothing is highlighted in the hero.
  const [active, setActive] = useState(null)
  const key = ids.join('|')

  useEffect(() => {
    const list = key.split('|')
    const visible = new Set()

    const resolve = () => {
      // Topmost section in document order wins.
      const inBand = list.find((id) => visible.has(id))
      if (inBand) return inBand

      // Nothing in the band. That is the end of the page: the last section is
      // short and sits above the footer, so the page runs out of scroll before
      // it can reach the band and the previous section stayed highlighted for
      // good. Fall back to the last section that has already started above it.
      return list.findLast((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top <= offset : false
      })
    }

    const sync = () => {
      const next = resolve()
      if (next) setActive(next)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        sync()
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 },
    )

    for (const id of list) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }

    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [key, offset])

  return active
}
