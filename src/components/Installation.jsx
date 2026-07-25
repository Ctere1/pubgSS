import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { steps } from '../data/content.js'
import { ExternalLink } from './ExternalLink.jsx'
import { ArrowIcon, ShieldIcon } from './Icons.jsx'
import { Modal } from './Modal.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

export function Installation() {
  const { t } = useTranslation()
  const [securityOpen, setSecurityOpen] = useState(false)

  return (
    <Section
      id="installation"
      eyebrow={t('installation.eyebrow')}
      title={t('installation.title')}
      lead={t('installation.lead')}
      muted
    >
      <ol className="max-w-2xl">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <Reveal as="li" key={step.id} delay={i * 80} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-xs text-ink-faint">
                  {i + 1}
                </span>
                {!isLast && <span className="my-2 w-px flex-1 bg-line" />}
              </div>

              <div className={isLast ? 'pt-1' : 'pb-10 pt-1'}>
                <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
                  {t(`installation.steps.${step.id}.title`)}
                  {/* Where the build comes from matters at exactly this step,
                      and only to the people who ask: a quiet mark rather than a
                      block of small print in the flow. */}
                  {step.id === 'download' && (
                    <button
                      type="button"
                      onClick={() => setSecurityOpen(true)}
                      aria-label={t('a11y.securityInfo')}
                      // Same string as the label: the native tooltip explains
                      // the mark on hover, before anyone has to click it.
                      title={t('a11y.securityInfo')}
                      className="grid size-6 cursor-pointer place-items-center rounded-md text-ink-faint transition-colors hover:bg-surface hover:text-accent"
                    >
                      <ShieldIcon width="15" height="15" />
                    </button>
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {t(`installation.steps.${step.id}.body`)}
                </p>

                {step.code && <code className="mt-3 inline-block">{step.code}</code>}

                {step.action && (
                  <ExternalLink
                    href={step.action}
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    {t(`installation.steps.${step.id}.action`)}
                    <ArrowIcon
                      width="16"
                      height="16"
                      className="transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </ExternalLink>
                )}
              </div>
            </Reveal>
          )
        })}
      </ol>

      {securityOpen && (
        <Modal
          title={t('installation.securityTitle')}
          icon={<ShieldIcon width="15" height="15" />}
          onClose={() => setSecurityOpen(false)}
        >
          {t('installation.securityText')}
        </Modal>
      )}
    </Section>
  )
}
