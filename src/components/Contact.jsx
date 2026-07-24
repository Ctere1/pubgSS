import { useTranslation } from 'react-i18next'
import { links } from '../data/content.js'
import { Button } from './Button.jsx'
import { GitHubIcon, MailIcon } from './Icons.jsx'
import { Meteors } from './Meteors.jsx'
import { Reveal } from './Reveal.jsx'
import { Section } from './Section.jsx'

export function Contact() {
  const { t } = useTranslation()

  return (
    <Section
      id="contact"
      eyebrow={t('contact.eyebrow')}
      title={t('contact.title')}
      lead={t('contact.lead')}
      muted
      background={<Meteors count={20} />}
    >
      <Reveal className="flex flex-wrap gap-3">
        <Button href={links.profile} external variant="ghost">
          <GitHubIcon width="18" height="18" />
          {t('contact.github')}
        </Button>
        <Button href={links.mail} variant="ghost">
          <MailIcon width="18" height="18" />
          {t('contact.email')}
        </Button>
      </Reveal>
    </Section>
  )
}
