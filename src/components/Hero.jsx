import { useTranslation } from 'react-i18next'
import { links } from '../data/content.js'
import { useRelease } from '../hooks/useRelease.js'
import { Button } from './Button.jsx'
import { DownloadMenu } from './DownloadMenu.jsx'
import { Eyebrow } from './Eyebrow.jsx'
import { DownloadIcon, HeartIcon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'
import { ShotSlider } from './ShotSlider.jsx'

export function Hero() {
  const { t } = useTranslation()
  const { downloads } = useRelease()

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
          <DownloadMenu size="lg" className="w-full sm:w-auto" />
          <Button
            href={links.sponsor}
            size="lg"
            variant="ghost"
            // Matched to the download button beside it (DownloadMenu.jsx) —
            // keep the two in step.
            className="btn-sponsor w-full sm:w-auto sm:min-w-68"
          >
            <HeartIcon width="18" height="18" className="icon-heart" />
            {t('hero.sponsor')}
          </Button>
        </Reveal>

        {/* The strongest reason to trust the download is how many people
            already took it, so it gets a chip of its own rather than a clause
            at the end of the fine print.

            The row keeps its height whether or not the count is in yet: the
            number comes from the API well after first paint, and reserving the
            space means it lands without moving anything. */}
        <div className="mt-6 flex h-7 items-center justify-center">
          {downloads !== null && (
            <Reveal
              as="span"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-medium tabular-nums text-ink-soft"
            >
              <DownloadIcon width="13" height="13" className="text-accent" />
              {t('hero.downloads', { count: downloads })}
            </Reveal>
          )}
        </div>

        <Reveal delay={240} className="mt-3 text-xs text-ink-faint">
          {t('hero.meta')}
        </Reveal>
      </div>

      <Reveal delay={120} className="relative mx-auto max-w-5xl px-6 pb-20">
        <ShotSlider />
      </Reveal>
    </section>
  )
}
