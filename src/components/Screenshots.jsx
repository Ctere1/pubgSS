import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { screenshots } from '../data/content.js'
import { Lightbox } from './Lightbox.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

export function Screenshots() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState(null)
  const triggers = useRef([])

  const close = () => {
    const trigger = triggers.current[openIndex]
    setOpenIndex(null)
    trigger?.focus()
  }

  const open = openIndex !== null ? screenshots[openIndex] : null

  return (
    <Section
      id="screenshots"
      eyebrow={t('screenshots.eyebrow')}
      title={t('screenshots.title')}
      lead={t('screenshots.lead')}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {screenshots.map((shot, i) => (
          <Reveal key={shot.id} delay={(i % 2) * 80}>
            <button
              type="button"
              ref={(el) => {
                triggers.current[i] = el
              }}
              onClick={() => setOpenIndex(i)}
              className="group block w-full overflow-hidden rounded-xl border border-line bg-surface-raised text-left transition-colors hover:border-line-strong"
            >
              <span className="block overflow-hidden">
                <img
                  src={shot.src}
                  alt={t(`screenshots.shots.${shot.id}.alt`)}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                />
              </span>
              <span className="block border-t border-line px-4 py-3 text-xs font-medium tracking-wide text-ink-soft">
                {t(`screenshots.shots.${shot.id}.caption`)}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open && (
        <Lightbox
          src={open.src}
          alt={t(`screenshots.shots.${open.id}.alt`)}
          caption={t(`screenshots.shots.${open.id}.caption`)}
          onClose={close}
        />
      )}
    </Section>
  )
}
