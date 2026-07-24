import { useTranslation } from 'react-i18next'
import { languages } from '../i18n.js'
import { GlobeIcon } from './Icons.jsx'

/**
 * Native <select> on purpose: keyboard, screen reader and mobile behaviour
 * come for free, and it stays compact in the header.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative flex items-center">
      <GlobeIcon
        width="16"
        height="16"
        className="pointer-events-none absolute left-2.5 text-ink-faint"
      />
      <select
        aria-label={t('a11y.language')}
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-lg bg-transparent pl-8 pr-2 text-xs font-medium text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
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
