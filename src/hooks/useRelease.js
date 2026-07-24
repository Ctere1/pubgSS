import { useEffect, useState } from 'react'
import { releasesApi } from '../data/content.js'

const CACHE_KEY = 'pubgss-release'

/** `1.2.3`, `V1.2.3`, `release-1.2.3` → `v1.2.3`. */
const normaliseTag = (tag) => {
  const number = String(tag ?? '').match(/\d+(\.\d+)*/)?.[0]
  return number ? `v${number}` : null
}

/**
 * The one call to the public GitHub releases API: the newest tag name and the
 * total downloads across every release asset. Both come from the same response,
 * so they share a fetch and a cache — the unauthenticated API allows only 60
 * requests an hour per IP address.
 *
 * `downloads` is null while loading, on failure and — deliberately — whenever
 * the total is below `minimum`: a landing page that advertises a handful of
 * downloads reads worse than one that says nothing. Lower it to 0 to always
 * show the number. `version` is null only while loading or on failure.
 */
export function useRelease({ minimum = 50 } = {}) {
  const [release, setRelease] = useState({ downloads: null, version: null })

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        setRelease(JSON.parse(cached))
        return
      } catch {
        // Corrupt entry — fall through and fetch again.
      }
    }

    const controller = new AbortController()

    fetch(releasesApi, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((releases) => {
        const next = {
          downloads: releases.reduce(
            (sum, item) =>
              sum + item.assets.reduce((assetSum, asset) => assetSum + asset.download_count, 0),
            0,
          ),
          // The API returns releases newest first; skip drafts and prereleases.
          version: normaliseTag(
            releases.find((item) => !item.draft && !item.prerelease)?.tag_name,
          ),
        }
        setRelease(next)
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
      })
      .catch(() => {
        // Offline, rate limited or API change — just show nothing.
      })

    return () => controller.abort()
  }, [])

  return {
    downloads:
      release.downloads !== null && release.downloads >= minimum ? release.downloads : null,
    version: release.version,
  }
}
