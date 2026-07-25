import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { faqs } from '../data/content.js'
import { ChevronDownIcon, LinkIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

const anchorId = (id) => `faq-${id}`

/**
 * The questions people actually arrive with, chiefly whether this is a cheat.
 * Native <details>, so it opens without JavaScript and stays findable by the
 * browser's in-page search.
 *
 * Each answer has its own anchor, so one question can be linked directly —
 * which is the usual way these get shared, one reply at a time.
 */
export function Faq() {
  const { t } = useTranslation()

  // A linked question has to be open to be worth linking to. CSS can't set the
  // `open` attribute, so :target isn't enough on its own.
  useEffect(() => {
    const openTarget = () => {
      const hash = window.location.hash.slice(1)
      if (!hash.startsWith('faq-')) return
      const target = document.getElementById(hash)
      if (!target) return
      target.open = true
      // Redo the jump now that the answer has its full height — on a cold load
      // the browser could not do it at all (React had not rendered the list
      // yet), and on a hash change it landed while the answer was collapsed.
      //
      // `instant` overrides the page's smooth scrolling on purpose: this is an
      // anchor arrival, and gliding several thousand pixels down the page is
      // not what following a link should feel like.
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
    }

    openTarget()
    window.addEventListener('hashchange', openTarget)
    return () => window.removeEventListener('hashchange', openTarget)
  }, [])

  return (
    <Section id="faq" eyebrow={t('faq.eyebrow')} title={t('faq.title')} lead={t('faq.lead')}>
      <div className="grid gap-3">
        {faqs.map((id, i) => (
          <Reveal key={id} delay={i * 60}>
            <details
              id={anchorId(id)}
              open={i === 0}
              className="group rounded-lg border border-line bg-surface-raised px-5 open:border-line-strong"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[15px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                {t(`faq.items.${id}.q`)}

                <span className="flex shrink-0 items-center gap-1">
                  {/* A real anchor, so it can be copied from the context menu
                      and followed by keyboard. The click must not reach the
                      summary, or grabbing the link would collapse the answer. */}
                  <a
                    href={`#${anchorId(id)}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={t('a11y.questionLink')}
                    title={t('a11y.questionLink')}
                    className="grid size-6 place-items-center rounded-md text-ink-faint opacity-0 transition hover:bg-surface hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <LinkIcon width="13" height="13" />
                  </a>

                  <ChevronDownIcon
                    width="16"
                    height="16"
                    className="text-ink-faint transition-transform duration-300 group-open:rotate-180"
                  />
                </span>
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-ink-soft">
                {t(`faq.items.${id}.a`)}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
