import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n.js'
import { CheckIcon, ChevronDownIcon, GlobeIcon } from './Icons.jsx'

/**
 * Custom menu rather than a native <select>: an invisible select stretched over
 * the control made the browser scroll the sticky header into view every time it
 * took focus, and its popup could not be styled at all.
 *
 * Closes on outside click, on Escape (focus returns to the trigger) and after a
 * choice. Only the globe shows on phones — a full language name made the
 * control far wider than the neighbouring icon buttons.
 */
/** The section the reader is currently on: the last one starting above the
 *  header band, or the first if the page is still at the top. */
const anchorSection = () => {
  const sections = [...document.querySelectorAll('#main > section[id]')]
  return sections.findLast((el) => el.getBoundingClientRect().top <= 120) ?? sections[0] ?? null
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const menuId = useId()

  const current = languages.find((l) => l.code === i18n.resolvedLanguage)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (code) => {
    setOpen(false)
    triggerRef.current?.focus()
    if (code === i18n.resolvedLanguage) return

    // Every string on the page is a different length in the new language, so
    // whatever you were reading slides up or down as the copy above it grows or
    // shrinks. Pin the section under the header: note where it starts now, and
    // put it back there once React has re-rendered with the new strings.
    const anchor = anchorSection()
    const before = anchor?.getBoundingClientRect().top

    i18n.changeLanguage(code).then(() => {
      if (!anchor) return
      // Two frames: one for the re-render, one for the layout it causes.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const delta = anchor.getBoundingClientRect().top - before
          if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' })
        }),
      )
    })
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t('a11y.language')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-9 ${
          open ? 'bg-surface-muted text-ink' : ''
        }`}
      >
        <GlobeIcon width="18" height="18" className="mx-2.5 shrink-0" />
        <span className="hidden text-xs font-medium md:inline">{current?.label}</span>
        <ChevronDownIcon
          width="14"
          height="14"
          className={`ml-1 mr-2 hidden shrink-0 text-ink-faint transition-transform duration-200 md:block ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('a11y.language')}
          className="absolute right-0 top-full z-30 mt-2 min-w-44 overflow-hidden rounded-xl border border-line bg-surface-raised p-1.5 text-left shadow-lg"
        >
          {languages.map((language) => {
            const isCurrent = language.code === i18n.resolvedLanguage
            return (
              <button
                key={language.code}
                type="button"
                role="menuitemradio"
                aria-checked={isCurrent}
                onClick={() => select(language.code)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-muted ${
                  isCurrent ? 'text-ink' : 'text-ink-soft'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="w-6 shrink-0 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                    {language.code}
                  </span>
                  <span className="truncate text-sm font-medium">{language.label}</span>
                </span>
                {isCurrent && (
                  <CheckIcon width="15" height="15" className="shrink-0 text-accent" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
