import { useTranslation } from 'react-i18next'
import { faqs } from '../data/content.js'
import { ChevronDownIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

/**
 * The questions people actually arrive with, chiefly whether this is a cheat.
 * Native <details>, so it opens without JavaScript and stays findable by the
 * browser's in-page search.
 */
export function Faq() {
  const { t } = useTranslation()

  return (
    <Section
      id="faq"
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
      lead={t('faq.lead')}
    >
      <div className="grid gap-3">
        {faqs.map((id, i) => (
          <Reveal key={id} delay={i * 60}>
            <details
              open={i === 0}
              className="group rounded-lg border border-line bg-surface-raised px-5 open:border-line-strong"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                {t(`faq.items.${id}.q`)}
                <ChevronDownIcon
                  width="16"
                  height="16"
                  className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180"
                />
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
