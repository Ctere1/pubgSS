import { useTranslation } from 'react-i18next'
import { appIcon, links, nav } from '../data/content.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { HeartIcon, MoonIcon, SunIcon } from './Icons.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'

export function Header({ theme, onToggleTheme }) {
  const { t } = useTranslation()
  const active = useActiveSection(nav)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-md">
      {/* Three columns so the nav sits dead centre on desktop: the two 1fr
          side columns split the leftover space evenly around the auto-width
          nav. Below md the nav takes the free space and scrolls instead. */}
      <div className="mx-auto grid h-16 max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:grid-cols-[1fr_auto_1fr]">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <img src={appIcon} alt="" width="24" height="24" className="size-6 rounded" />
          <span className="hidden text-sm font-semibold tracking-tight lg:inline">
            Stream Sniping Detector
          </span>
        </a>

        <nav aria-label={t('a11y.sections')} className="-mx-1 min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-1 px-1 [scrollbar-width:none]">
            {nav.map((id) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`inline-flex h-16 items-center whitespace-nowrap px-2.5 text-sm transition-colors ${
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {/* The underline hangs off the label, not the 64px tall
                        hit area, so it stays close to the text. */}
                    <span className="relative">
                      {t(`nav.${id}`)}
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-accent" />
                      )}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* justify-end pins the controls to the right edge of their column,
            keeping them clear of the nav instead of hugging it. */}
        <div className="flex items-center justify-end gap-1">
          <LanguageSwitcher />
          <a
            href={links.sponsor}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('a11y.sponsor')}
            className="group grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-rose-500"
          >
            {/* The lucide path carries fill="none", so the fill has to be
                overridden on the path itself, not on the <svg>. */}
            <HeartIcon
              width="18"
              height="18"
              className="[&_path]:transition-[fill] [&_path]:duration-200 group-hover:[&_path]:fill-current"
            />
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t('a11y.themeToLight') : t('a11y.themeToDark')}
            className="grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
          >
            {theme === 'dark' ? (
              <SunIcon width="18" height="18" />
            ) : (
              <MoonIcon width="18" height="18" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
