import { useTranslation } from 'react-i18next'
import { links, previewShot } from '../data/content.js'
import { useShotText } from '../hooks/useShotText.js'
import { Button } from './Button.jsx'
import { Eyebrow } from './Eyebrow.jsx'
import { DownloadIcon, HeartIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'

export function Hero() {
  const { t } = useTranslation()
  const preview = useShotText(previewShot)

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_50%_at_50%_50%,var(--accent-soft),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center md:pt-28">
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>

        <Reveal
          as="h1"
          delay={60}
          className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl"
        >
          {t('hero.title')}
        </Reveal>

        <Reveal
          as="p"
          delay={120}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft"
        >
          {t('hero.lead')}
        </Reveal>

        <Reveal delay={180} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {/* Full width on phones so both stay comfortable tap targets. */}
          {/* sameTab: the .exe is served as an attachment, so a new tab would
              open empty and stay there. */}
          <Button
            href={links.download}
            sameTab
            size="lg"
            className="btn-download w-full sm:w-auto"
          >
            <DownloadIcon width="18" height="18" className="icon-download" />
            {t('hero.download')}
          </Button>
          <Button
            href={links.sponsor}
            size="lg"
            variant="ghost"
            className="btn-sponsor w-full sm:w-auto"
          >
            <HeartIcon width="18" height="18" className="icon-heart" />
            {t('hero.sponsor')}
          </Button>
        </Reveal>

        <Reveal delay={240} className="mt-6 text-xs text-ink-faint">
          {t('hero.meta')}
        </Reveal>
      </div>

      <Reveal delay={120} className="relative mx-auto max-w-5xl px-6 pb-20">
        <div className="overflow-hidden rounded-xl border border-line bg-surface-raised">
          <img
            src={previewShot.src}
            alt={preview.alt}
            width={previewShot.width}
            height={previewShot.height}
            fetchPriority="high"
            className="w-full"
          />
        </div>
      </Reveal>
    </section>
  )
}
