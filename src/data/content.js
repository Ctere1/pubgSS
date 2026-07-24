/**
 * Structural content only — every user-facing string lives in src/locales/*.json
 * and is looked up by the ids below (e.g. `features.json.title`).
 */
const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const links = {
  releases: 'https://github.com/Ctere1/pubgSS/releases',
  profile: 'https://github.com/Ctere1',
  sponsor: 'https://github.com/sponsors/Ctere1',
  mail: 'mailto:cemiltan896@gmail.com',
}

export const appIcon = asset('icon-64.png')

export const nav = ['overview', 'installation', 'screenshots', 'contact']

export const features = ['json', 'pdf', 'compare']

export const steps = [
  { id: 'download', action: links.releases },
  { id: 'run', code: 'pubg-stream-sniping-detector.exe' },
  { id: 'analyse' },
]

export const screenshots = [
  { id: 'login', src: asset('screenshots/ss1.png') },
  { id: 'dashboard', src: asset('screenshots/ss2.png') },
  { id: 'analysis', src: asset('screenshots/ss3.png') },
  { id: 'comparison', src: asset('screenshots/ss4.png') },
]
