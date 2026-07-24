import { useTranslation } from 'react-i18next'
import { appIcon, links } from '../data/content.js'

const footerLinks = [
  { key: 'github', href: links.profile },
  { key: 'releases', href: links.releases },
  { key: 'sponsor', href: links.sponsor },
]

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <img src={appIcon} alt="" width="16" height="16" className="size-4 rounded-sm" />
          {t('footer.copyright', { year: new Date().getFullYear() })}
          <span aria-hidden="true">·</span>
          <span>
            {t('footer.builtBy')}{' '}
            <a
              href={links.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              Ctere1
            </a>
          </span>
        </p>

        <nav aria-label={t('a11y.footerNav')} className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {t(`footer.${link.key}`)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
