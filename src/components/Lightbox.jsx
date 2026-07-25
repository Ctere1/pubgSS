import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollLock } from '../hooks/useScrollLock.js'
import { useShotText } from '../hooks/useShotText.js'
import { CloseIcon } from './Icons.jsx'

/**
 * Full-screen screenshot viewer. Closes on Escape and on backdrop click,
 * locks page scroll while open, moves focus to the close button on open and
 * hands it back to the thumbnail that opened it (see useLightbox).
 */
export function Lightbox({ shot, onClose }) {
  const { t } = useTranslation()
  const { caption, alt } = useShotText(shot)
  const closeRef = useRef(null)

  useScrollLock()

  useEffect(() => {
    closeRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    // The backdrop closes on click as a convenience; Escape is the keyboard
    // equivalent and is bound on the document above. Making the backdrop itself
    // focusable would put a second, meaningless stop in the tab order.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t('a11y.closeViewer')}
        className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <CloseIcon width="20" height="20" />
      </button>

      <img
        src={shot.src}
        alt={alt}
        width={shot.width}
        height={shot.height}
        className="max-h-[82vh] w-auto max-w-full rounded-lg"
      />
      <p className="text-xs tracking-wide text-white/70">{caption}</p>
    </div>
  )
}
