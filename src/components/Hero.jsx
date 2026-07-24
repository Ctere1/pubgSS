import { useTranslation } from 'react-i18next'
import { links, screenshots } from '../data/content.js'
import { Button } from './Button.jsx'
import { DownloadIcon, HeartIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'

export function Hero() {
  const { t } = useTranslation()
  const preview = screenshots[1]

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_50%_at_50%_50%,var(--accent-soft),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center md:pt-28">
        <Reveal as="p" className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t('hero.eyebrow')}
        </Reveal>

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
          <Button href={links.releases} external size="lg" className="btn-download">
            <DownloadIcon width="18" height="18" className="icon-download" />
            {t('hero.download')}
          </Button>
          <Button href={links.sponsor} external size="lg" variant="ghost" className="group">
            <HeartIcon
              width="18"
              height="18"
              className="transition-colors duration-200 group-hover:text-rose-500 [&_path]:transition-[fill] [&_path]:duration-200 group-hover:[&_path]:fill-current"
            />
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
            src={preview.src}
            alt={t(`screenshots.shots.${preview.id}.alt`)}
            width="1280"
            height="800"
            className="w-full"
          />
        </div>
      </Reveal>
    </section>
  )
}
