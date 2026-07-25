import { useEffect, useState } from 'react'
import { releasesApi } from '../data/content.js'

const CACHE_KEY = 'pubgss-release'
const EMPTY = { downloads: null, version: null }

/** `1.2.3`, `V1.2.3`, `release-1.2.3` → `v1.2.3`. */
const normaliseTag = (tag) => {
  const number = String(tag ?? '').match(/\d+(\.\d+)*/)?.[0]
  return number ? `v${number}` : null
}

const readCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    // Missing, corrupt, or storage blocked entirely — fetch instead.
    return null
  }
}

/**
 * The in-flight (or settled) request, shared by every caller.
 *
 * The fetch lives at module scope rather than inside the effect because three
 * components read this data — Hero, Footer and DownloadMenu. One request per
 * hook call meant three per page load, and six under StrictMode in dev, since
 * they all start before any of them can write the cache. The unauthenticated
 * API allows 60 requests an hour per IP, so that was worth spending nothing on.
 */
let pending = null

function loadRelease() {
  if (pending) return pending

  const cached = readCache()
  if (cached) {
    pending = Promise.resolve(cached)
    return pending
  }

  pending = fetch(releasesApi)
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((releases) => {
      const next = {
        downloads: releases.reduce(
          (sum, item) =>
            sum + item.assets.reduce((assetSum, asset) => assetSum + asset.download_count, 0),
          0,
        ),
        // The API returns releases newest first; skip drafts and prereleases.
        version: normaliseTag(releases.find((item) => !item.draft && !item.prerelease)?.tag_name),
      }
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
      } catch {
        // Private mode or a full quota — the in-memory promise still serves.
      }
      return next
    })
    .catch(() => {
      // Offline, rate limited or API change — show nothing, and let a later
      // mount try again rather than holding the failure for the whole session.
      pending = null
      return EMPTY
    })

  return pending
}

/**
 * The newest tag name and the total downloads across every release asset. Both
 * come from the same response, so they share one request for the whole page.
 *
 * `downloads` is null while loading, on failure and — deliberately — whenever
 * the total is below `minimum`: a landing page that advertises a handful of
 * downloads reads worse than one that says nothing. Lower it to 0 to always
 * show the number. `version` is null only while loading or on failure.
 */
export function useRelease({ minimum = 50 } = {}) {
  // A cache hit is known before the first paint, so a second visit within the
  // session renders the number straight away instead of popping it in.
  const [release, setRelease] = useState(() => readCache() ?? EMPTY)

  useEffect(() => {
    let active = true
    // No AbortController: the request is shared, so one component unmounting
    // must not cancel it for the others.
    loadRelease().then((value) => {
      if (active) setRelease(value)
    })
    return () => {
      active = false
    }
  }, [])

  return {
    downloads:
      release.downloads !== null && release.downloads >= minimum ? release.downloads : null,
    version: release.version,
  }
}
