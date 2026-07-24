import { Reveal } from './Reveal.jsx'

/**
 * Shared shell for every page section: the anchor id, the content column
 * width and the eyebrow / title / lead heading block.
 */
export function Section({ id, eyebrow, title, lead, muted = false, children }) {
  return (
    <section
      id={id}
      className={muted ? 'border-y border-line bg-surface-muted' : undefined}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          {eyebrow && (
            <Reveal as="p" className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </Reveal>
          )}
          <Reveal
            as="h2"
            delay={60}
            className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {title}
          </Reveal>
          {lead && (
            <Reveal as="p" delay={120} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {lead}
            </Reveal>
          )}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
