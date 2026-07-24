import { Reveal } from './Reveal.jsx'

/** Small accent label above a heading. */
export function Eyebrow({ delay, children }) {
  return (
    <Reveal
      as="p"
      delay={delay}
      className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
    >
      {children}
    </Reveal>
  )
}
