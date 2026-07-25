import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollLock } from '../hooks/useScrollLock.js'
import { CloseIcon } from './Icons.jsx'

/**
 * Small centred dialog for a short piece of prose. Closes on Escape and on
 * backdrop click, locks page scroll while open, takes focus on open and hands
 * it back to whatever opened it (same contract as Lightbox, which stays
 * separate because it frames an image rather than text).
 */
export function Modal({ title, icon, onClose, children }) {
  const { t } = useTranslation()
  const titleId = useId()
  const closeRef = useRef(null)
  const openerRef = useRef(null)

  useScrollLock()

  useEffect(() => {
    openerRef.current = document.activeElement
    closeRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      openerRef.current?.focus?.()
    }
  }, [onClose])

  return (
    // Same as Lightbox: backdrop click is the convenience, Escape is the
    // keyboard path, and it is bound on the document above.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-xl border border-line bg-surface-raised p-6 shadow-lg">
        <div className="flex items-start gap-4">
          {icon && (
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
              {icon}
            </span>
          )}
          <h3 id={titleId} className="pt-1 text-[15px] font-semibold tracking-tight">
            {title}
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('a11y.close')}
            className="-mr-2 -mt-2 ml-auto grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <CloseIcon width="16" height="16" />
          </button>
        </div>

        <div className="mt-3 text-sm leading-relaxed text-ink-soft">{children}</div>
      </div>
    </div>
  )
}
