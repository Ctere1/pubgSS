import { useMemo } from 'react'

/**
 * Slow diagonal meteors for the contact section — the one decorative moment on
 * the page. Pure CSS animation (see `.meteor` in index.css), no dependency,
 * and hidden entirely under prefers-reduced-motion.
 *
 * They fall towards the bottom left, so start points are spread evenly across
 * the top and past the right edge (even spacing plus jitter, rather than pure
 * randomness, keeps them from clumping).
 */
const jitter = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function Meteors({ count = 20 }) {
  // The jitter is derived from the index rather than drawn from Math.random:
  // rendering has to be pure, and a hash gives the same scattered look while
  // staying identical across re-renders.
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const step = 130 / count
        return {
          key: i,
          left: `${(i * step + jitter(i, 1) * step).toFixed(2)}%`,
          top: `${(-4 - jitter(i, 2) * 12).toFixed(2)}%`,
          delay: `${(jitter(i, 3) * 8).toFixed(2)}s`,
          duration: `${(5 + jitter(i, 4) * 5).toFixed(2)}s`,
        }
      }),
    [count],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((meteor) => (
        <span
          key={meteor.key}
          className="meteor"
          style={{
            left: meteor.left,
            top: meteor.top,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  )
}
