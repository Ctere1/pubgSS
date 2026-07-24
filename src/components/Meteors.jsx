import { useMemo } from 'react'

/**
 * Slow diagonal meteors for the contact section — the one decorative moment on
 * the page. Pure CSS animation (see `.meteor` in index.css), no dependency,
 * and hidden entirely under prefers-reduced-motion.
 *
 * They fall towards the bottom left, so start points are spread evenly across
 * the top and past the right edge (even spacing plus jitter, rather than pure
 * randomness, keeps them from clumping).
 *
 * Positions are randomised once per mount; the app renders client-side only,
 * so there is no server markup to mismatch.
 */
export function Meteors({ count = 20 }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const step = 130 / count
        return {
          key: i,
          left: `${(i * step + Math.random() * step).toFixed(2)}%`,
          top: `${(-4 - Math.random() * 12).toFixed(2)}%`,
          delay: `${(Math.random() * 8).toFixed(2)}s`,
          duration: `${(5 + Math.random() * 5).toFixed(2)}s`,
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
