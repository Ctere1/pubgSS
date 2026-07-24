import { useTranslation } from 'react-i18next'
import { languages } from '../i18n.js'
import { GlobeIcon } from './Icons.jsx'

/**
 * Native <select> on purpose: keyboard, screen reader and mobile picker
 * behaviour come for free.
 *
 * The select itself is transparent and stretched over the control, so what you
 * see is the globe alone on phones (where a full language name made it far
 * wider than the neighbouring icon buttons) and globe + label from md up. It
 * keeps a 16px font because iOS Safari zooms the page when a focused form
 * control has smaller text — invisible or not, that still applies.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = languages.find((l) => l.code === i18n.resolvedLanguage)

  return (
    <div className="relative flex h-10 items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent md:h-9">
      <GlobeIcon width="18" height="18" className="pointer-events-none mx-2.5 shrink-0" />
      <span className="pointer-events-none hidden pr-2.5 text-xs font-medium md:inline">
        {current?.label}
      </span>

      <select
        aria-label={t('a11y.language')}
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent text-base opacity-0"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code} className="bg-surface text-ink">
            {language.label}
          </option>
        ))}
      </select>
    </div>
  )
}
