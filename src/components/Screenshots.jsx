import { useTranslation } from 'react-i18next'
import { screenshots } from '../data/content.js'
import { useLightbox } from '../hooks/useLightbox.js'
import { useShotText } from '../hooks/useShotText.js'
import { ExpandIcon } from './Icons.jsx'
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
      className="group block w-full overflow-hidden rounded-2xl border border-line bg-surface-raised text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg"
    >
      <span className="relative block overflow-hidden">
        <img
          src={shot.src}
          alt={alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* Scrim + zoom affordance surface on hover / keyboard focus. */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="pointer-events-none absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-lg bg-black/55 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ExpandIcon width="15" height="15" />
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="text-xs font-medium tracking-wide text-ink-soft transition-colors group-hover:text-ink">
          {caption}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-ink-faint">
          {String(index + 1).padStart(2, '0')}
        </span>
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
      <div className="grid gap-5 sm:grid-cols-2">
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
