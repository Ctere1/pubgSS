import { ExternalLink } from './ExternalLink.jsx'

// `cursor-pointer` is explicit: Tailwind's reset leaves buttons on the UA
// default (an arrow), which read as disabled next to the links beside them.
const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium ' +
  'transition-colors duration-150 whitespace-nowrap'

const variants = {
  primary: 'bg-btn text-btn-fg hover:bg-btn-hover',
  ghost: 'border border-line text-ink hover:border-line-strong hover:bg-surface-muted',
}

const sizes = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

/**
 * Renders a <button>, or a link when `href` is given. An in-page anchor stays
 * in this tab; anything else goes through ExternalLink.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  sameTab = false,
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    // In-page anchors are plain <a>; `sameTab` only means something to
    // ExternalLink, so it is never forwarded to the DOM.
    if (href.startsWith('#')) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      )
    }

    return (
      <ExternalLink href={href} sameTab={sameTab} className={classes} {...rest}>
        {children}
      </ExternalLink>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
