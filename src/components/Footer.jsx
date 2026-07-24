import { useTranslation } from 'react-i18next'
import { appIcon, links } from '../data/content.js'
import { ExternalLink } from './ExternalLink.jsx'

const footerLinks = [
  { key: 'footer.github', href: links.profile },
  { key: 'footer.releases', href: links.releases },
  { key: 'footer.sponsor', href: links.sponsor },
  { key: 'contact.email', href: links.mail },
]

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <img src={appIcon} alt="" width="32" height="32" className="size-8 rounded-md" />
            <div>
              <p className="text-sm font-semibold tracking-tight">Stream Sniping Detector</p>
              <p className="mt-1 text-xs text-ink-faint">{t('footer.tagline')}</p>
            </div>
          </div>

          <nav
            aria-label={t('a11y.footerNav')}
            className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-ink-soft"
          >
            {footerLinks.map((link) => (
              <ExternalLink
                key={link.key}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {t(link.key)}
              </ExternalLink>
            ))}
          </nav>
        </div>

        {/* Trademark attribution and non-endorsement notice. Left in English
            rather than translated, as such notices conventionally are. */}
        <p className="mt-10 border-t border-line pt-6 text-[11px] leading-relaxed text-ink-faint">
          PUBG, PLAYERUNKNOWN&apos;S BATTLEGROUNDS and all related logos are trademarks of
          PUBG Corporation or its affiliates. This project is independent and is not
          affiliated with, endorsed by or sponsored by PUBG Corporation.
        </p>

        <div className="mt-6 flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>

          <p>
            {t('footer.builtBy')}{' '}
            <ExternalLink
              href={links.profile}
              className="text-ink-soft transition-colors hover:text-ink"
            >
              Ctere1
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  )
}
