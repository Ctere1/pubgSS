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
      {/* On phones the brand and the controls share the first row and the nav
          wraps onto its own full-width scrollable strip — squeezing all three
          into one row left the nav about 90px wide. From md up the very same
          three nodes become a grid whose 1fr side columns centre the nav. */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center px-6 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <a href="#top" className="order-1 flex h-14 items-center gap-2.5 md:h-16">
          <img src={appIcon} alt="" width="24" height="24" className="size-6 rounded" />
          <span className="hidden text-sm font-semibold tracking-tight lg:inline">
            Stream Sniping Detector
          </span>
        </a>

        <div className="order-2 ml-auto flex items-center gap-0.5 md:order-3 md:ml-0 md:justify-end md:gap-1">
          <LanguageSwitcher />

          <a
            href={links.sponsor}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('a11y.sponsor')}
            className="group grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-rose-500 md:size-9"
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
            className="grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink md:size-9"
          >
            {theme === 'dark' ? (
              <SunIcon width="18" height="18" />
            ) : (
              <MoonIcon width="18" height="18" />
            )}
          </button>
        </div>

        <nav
          aria-label={t('a11y.sections')}
          className="order-3 -mx-6 w-full overflow-x-auto border-t border-line md:order-2 md:mx-0 md:w-auto md:border-0"
        >
          <ul className="flex items-center gap-1 px-5 [scrollbar-width:none] md:px-0">
            {nav.map((id) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`inline-flex h-12 items-center whitespace-nowrap px-2.5 text-sm transition-colors md:h-16 ${
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {/* The underline hangs off the label, not the tall hit
                        area, so it stays close to the text. */}
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
      </div>
    </header>
  )
}
