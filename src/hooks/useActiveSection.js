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

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Topmost section in document order wins.
        const next = list.find((id) => visible.has(id))
        if (next) setActive(next)
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 },
    )

    for (const id of list) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [key, offset])

  return active
}
