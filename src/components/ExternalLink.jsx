/**
 * Anchor to somewhere off this page, with the security attributes that always
 * belong on `target="_blank"`. `mailto:` links keep the current tab, since
 * opening a blank one just leaves an empty window behind.
 */
export function ExternalLink({ href, children, ...rest }) {
  const opensTab = !href.startsWith('mailto:')

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
