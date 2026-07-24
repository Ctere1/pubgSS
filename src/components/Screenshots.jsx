import { useTranslation } from 'react-i18next'
import { screenshots } from '../data/content.js'
import { useLightbox } from '../hooks/useLightbox.js'
import { useShotText } from '../hooks/useShotText.js'
import { Lightbox } from './Lightbox.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

function Thumbnail({ shot, index, onOpen, onRegister }) {
  const { caption, alt } = useShotText(shot)

  return (
    <button
      type="button"
      ref={(el) => onRegister(index, el)}
      onClick={() => onOpen(index)}
      className="group block w-full overflow-hidden rounded-xl border border-line bg-surface-raised text-left transition-colors hover:border-line-strong"
    >
      <span className="block overflow-hidden">
        <img
          src={shot.src}
          alt={alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
      </span>
      <span className="block border-t border-line px-4 py-3 text-xs font-medium tracking-wide text-ink-soft">
        {caption}
      </span>
    </button>
  )
}

export function Screenshots() {
  const { t } = useTranslation()
  const lightbox = useLightbox(screenshots)

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
            <Thumbnail
              shot={shot}
              index={i}
              onOpen={lightbox.open}
              onRegister={lightbox.setTrigger}
            />
          </Reveal>
        ))}
      </div>

      {lightbox.item && <Lightbox shot={lightbox.item} onClose={lightbox.close} />}
    </Section>
  )
}
