import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { screenshots } from '../data/content.js'
import { useLightbox } from '../hooks/useLightbox.js'
import { useShotText } from '../hooks/useShotText.js'
import { useSlider } from '../hooks/useSlider.js'
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from './Icons.jsx'
import { Lightbox } from './Lightbox.jsx'

/** Past this much of a drag the slide changes; below it, it springs back. */
const SWIPE_RATIO = 0.12
const SWIPE_MIN = 48
/** Anything under this is a click, not a swipe, so the lightbox still opens. */
const CLICK_SLOP = 5

function Slide({ shot, active, index, onOpen, onRegister }) {
  const { t } = useTranslation()
  const { caption, alt } = useShotText(shot)

  return (
    <button
      type="button"
      ref={(el) => onRegister(index, el)}
      onClick={() => onOpen(index)}
      // Off-screen slides stay out of the tab order; only the visible one is
      // reachable, so tabbing through the page does not walk the whole gallery.
      tabIndex={active ? 0 : -1}
      aria-hidden={active ? undefined : 'true'}
      aria-label={t('a11y.viewShot', { caption })}
      className="group/slide relative block w-full shrink-0 cursor-zoom-in"
    >
      <img
        src={shot.src}
        alt={alt}
        width={shot.width}
        height={shot.height}
        // The opening slide is the hero image; the rest can wait.
        fetchPriority={index === 0 ? 'high' : undefined}
        loading={index === 0 ? undefined : 'lazy'}
        decoding={index === 0 ? undefined : 'async'}
        draggable="false"
        className="w-full select-none"
      />
      {/* The only hover affordance: no scrim over the shot itself. */}
      <span className="pointer-events-none absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-lg bg-black/55 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 group-focus-visible/slide:translate-y-0 group-focus-visible/slide:opacity-100">
        <ExpandIcon width="15" height="15" />
      </span>
    </button>
  )
}

function Arrow({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-7 cursor-pointer place-items-center rounded-md text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
    >
      {children}
    </button>
  )
}

/**
 * The hero preview: every screenshot in one frame, advancing on its own and
 * steerable by arrows, dots, swipe or the arrow keys. Clicking a slide opens
 * the same full-screen viewer the old gallery used.
 */
export function ShotSlider() {
  const { t } = useTranslation()
  const lightbox = useLightbox(screenshots)

  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [offset, setOffset] = useState(0)

  const drag = useRef(null)
  const frameRef = useRef(null)
  // A swipe ends with a click on the slide it started on; this swallows it so
  // the lightbox only opens on a real tap.
  const swiped = useRef(false)

  const { index, goTo, next, prev } = useSlider(screenshots.length, {
    paused: hovered || focused || offset !== 0 || lightbox.item !== null,
  })

  const active = screenshots[index]
  const { caption } = useShotText(active)

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    swiped.current = false
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
  }

  const onPointerMove = (e) => {
    const state = drag.current
    if (!state || state.id !== e.pointerId) return

    const dx = e.clientX - state.x
    // Vertical intent belongs to the page: let touch-action hand the gesture
    // back to the browser and drop ours.
    if (!state.moved && Math.abs(dx) < Math.abs(e.clientY - state.y)) return
    if (!state.moved && Math.abs(dx) <= CLICK_SLOP) return

    if (!state.moved) {
      state.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setOffset(dx)
  }

  const endDrag = (e) => {
    const state = drag.current
    if (!state || state.id !== e.pointerId) return
    drag.current = null
    swiped.current = state.moved

    const width = frameRef.current?.offsetWidth ?? 0
    const threshold = Math.max(width * SWIPE_RATIO, SWIPE_MIN)
    if (offset <= -threshold) next()
    else if (offset >= threshold) prev()
    setOffset(0)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  return (
    <>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t('screenshots.title')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        className="overflow-hidden rounded-xl border border-line bg-surface-raised"
      >
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative touch-pan-y overflow-hidden"
        >
          <div
            className="shot-track flex"
            style={{
              transform: `translate3d(calc(${index * -100}% + ${offset}px), 0, 0)`,
              // While a finger is down the track tracks the finger, not a curve.
              transition: offset === 0 ? undefined : 'none',
            }}
          >
            {screenshots.map((shot, i) => (
              <Slide
                key={shot.id}
                shot={shot}
                index={i}
                active={i === index}
                onOpen={(target) => {
                  if (!swiped.current) lightbox.open(target)
                }}
                onRegister={lightbox.setTrigger}
              />
            ))}
          </div>
        </div>

        {/* Caption on one side, the whole control cluster on the other: arrows
            and dots read as one group instead of floating over the shot. */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
          <span className="truncate text-xs font-medium tracking-wide text-ink-soft">
            {caption}
          </span>

          <span className="flex shrink-0 items-center gap-1">
            <Arrow label={t('a11y.prevShot')} onClick={prev}>
              <ChevronLeftIcon width="16" height="16" />
            </Arrow>

            <span className="flex items-center gap-1.5 px-1">
              {screenshots.map((shot, i) => (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={t('a11y.goToShot', { index: i + 1 })}
                  aria-current={i === index ? 'true' : undefined}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ease-out ${
                    i === index ? 'w-5 bg-ink' : 'w-1.5 bg-line-strong hover:bg-ink-faint'
                  }`}
                />
              ))}
            </span>

            <Arrow label={t('a11y.nextShot')} onClick={next}>
              <ChevronRightIcon width="16" height="16" />
            </Arrow>
          </span>
        </div>
      </div>

      {lightbox.item && <Lightbox shot={lightbox.item} onClose={lightbox.close} />}
    </>
  )
}
