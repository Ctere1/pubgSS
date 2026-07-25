import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { downloads } from '../data/content.js'
import { useRelease } from '../hooks/useRelease.js'
import { Button } from './Button.jsx'
import { ExternalLink } from './ExternalLink.jsx'
import { DownloadIcon } from './Icons.jsx'

/**
 * A single download button that opens a small menu to pick a build: Windows
 * installer, Windows portable, or the macOS universal app. Closes on outside
 * click, on Escape and after a choice is made.
 *
 * No caret or split-button divider: the button reads as one control. It still
 * announces itself as a menu trigger through aria-haspopup/aria-expanded, so
 * the affordance is only missing visually.
 *
 * sameTab on each item: the assets are served as attachments, so a new tab
 * would open empty and stay there.
 */
export function DownloadMenu({ size = 'lg', className = '' }) {
  const { t } = useTranslation()
  const { version } = useRelease()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <Button
        size={size}
        // A minimum width rather than more padding: the menu below is
        // `inset-x-0`, so it inherits the button's width, and the build labels
        // now carry a platform prefix ("Windows · Installer") with a file size
        // on the right. At the button's content width that pair was cramped.
        // Matched to the sponsor button beside it in Hero.jsx — keep the two in
        // step. The minimum also gives the menu room: it is `inset-x-0`, so it
        // inherits this width, and the build labels now carry a platform prefix
        // ("Windows · Installer") with a file size on the right.
        className="btn-download w-full sm:w-auto sm:min-w-[17rem]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <DownloadIcon width="18" height="18" className="icon-download" />
        {t('hero.download')}
      </Button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-line bg-surface-raised p-1.5 text-left shadow-lg"
        >
          {/* Only after the releases API answers — the tag is not known at
              build time, since both links point at `latest`. */}
          {version && (
            <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-line px-3 pb-2 pt-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                {t('hero.latest')}
              </span>
              <span className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-ink-soft">
                {version}
              </span>
            </div>
          )}

          {downloads.map((build) => (
            <ExternalLink
              key={build.id}
              href={build.href}
              sameTab
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-muted"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <DownloadIcon width="16" height="16" className="shrink-0 text-ink-faint" />
                <span className="text-sm font-medium text-ink">{t(`hero.${build.id}`)}</span>
              </span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-ink-faint">
                {build.size}
              </span>
            </ExternalLink>
          ))}
        </div>
      )}
    </div>
  )
}
