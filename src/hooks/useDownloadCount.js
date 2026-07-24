import { useEffect, useState } from 'react'
import { releasesApi } from '../data/content.js'

const CACHE_KEY = 'pubgss-download-count'

/**
 * Total downloads across every release asset, from the public GitHub API.
 *
 * Returns null while loading, on failure, and — deliberately — whenever the
 * total is below `minimum`: a landing page that advertises a handful of
 * downloads reads worse than one that says nothing. Lower it to 0 to always
 * show the number.
 *
 * Cached per tab because the unauthenticated API allows 60 requests an hour
 * per IP address.
 */
export function useDownloadCount({ minimum = 50 } = {}) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    const cached = Number(sessionStorage.getItem(CACHE_KEY))
    if (cached) {
      setCount(cached)
      return
    }

    const controller = new AbortController()

    fetch(releasesApi, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((releases) => {
        const total = releases.reduce(
          (sum, release) =>
            sum + release.assets.reduce((assetSum, asset) => assetSum + asset.download_count, 0),
          0,
        )
        setCount(total)
        sessionStorage.setItem(CACHE_KEY, String(total))
      })
      .catch(() => {
        // Offline, rate limited or API change — just show nothing.
      })

    return () => controller.abort()
  }, [])

  return count !== null && count >= minimum ? count : null
}
