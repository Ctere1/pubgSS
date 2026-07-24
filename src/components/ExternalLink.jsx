/**
 * Anchor to somewhere off this page, with the security attributes that always
 * belong on `target="_blank"`.
 *
 * Some links should not open a tab at all, because nothing ever renders in it:
 * `mailto:` hands off to a mail client (detected here), and a file download is
 * served as an attachment, so the browser just leaves an empty tab behind —
 * pass `sameTab` for those.
 */
export function ExternalLink({ href, sameTab = false, children, ...rest }) {
  const opensTab = !sameTab && !href.startsWith('mailto:')

  return (
    <a
      href={href}
      {...(opensTab ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
    </a>
  )
}
