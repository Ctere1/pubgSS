import { useTranslation } from 'react-i18next'
import { features } from '../data/content.js'
import { featureIcons } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

export function Features() {
  const { t } = useTranslation()

  return (
    <Section
      id="overview"
      eyebrow={t('overview.eyebrow')}
      title={t('overview.title')}
      lead={t('overview.lead')}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((id, i) => {
          const Icon = featureIcons[id]
          return (
            <Reveal
              key={id}
              as="article"
              delay={i * 80}
              className="rounded-lg border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong"
            >
              <span className="grid size-9 place-items-center rounded-md border border-line text-accent">
                <Icon width="18" height="18" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                {t(`features.${id}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {t(`features.${id}.text`)}
              </p>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-10 border-l-2 border-accent pl-5">
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">{t('overview.noteTitle')}</span>{' '}
          {t('overview.noteText')}
        </p>
      </Reveal>
    </Section>
  )
}
