import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Injects FAQPage structured data into index.html, built from the FAQ copy in
 * the locale file rather than a second hand-maintained copy of the answers.
 *
 * English only, deliberately: there is one URL and one canonical link, so the
 * crawler sees one page whose base language is English. The other locales are
 * a client-side switch, invisible to it either way.
 *
 * The questions ("is this a cheat", "can it get me banned") are the ones people
 * type into a search box, which is exactly what this markup is for.
 */
export function faqSchema({ locale = 'src/locales/en.json' } = {}) {
  let root = process.cwd()

  return {
    name: 'faq-schema',

    configResolved(config) {
      root = config.root
    },

    async transformIndexHtml() {
      const path = join(root, locale)

      let items
      try {
        const strings = JSON.parse(await readFile(path, 'utf8'))
        // Object order is file order, which is also the order on the page.
        items = Object.values(strings.faq?.items ?? {}).filter((item) => item?.q && item?.a)
      } catch (error) {
        this.warn?.(`faq-schema: could not read ${locale} — ${error.message}`)
        return
      }

      if (!items.length) {
        this.warn?.(`faq-schema: no faq.items in ${locale}, skipping`)
        return
      }

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }

      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          // Escaped so a `<` in an answer can never end the script element.
          children: JSON.stringify(schema).replaceAll('<', '\\u003c'),
          injectTo: 'head',
        },
      ]
    },
  }
}
