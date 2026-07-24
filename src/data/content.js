/**
 * Structural content only — every user-facing string lives in src/locales/*.json
 * and is looked up by the ids below (e.g. `features.json.title`).
 */
import shotManifest from 'virtual:screenshots'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const links = {
  /**
   * Serves the executable straight from the newest release — GitHub redirects
   * `latest/download/<asset>` to whichever tag is current, so this never needs
   * bumping. It does depend on the asset keeping this exact file name: if a
   * release ever ships e.g. a version-suffixed binary, this 404s.
   */
  download:
    'https://github.com/Ctere1/pubgSS/releases/latest/download/pubg-stream-sniping-detector.exe',
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

/**
 * Screenshots come from the screenshots-webp plugin: it converts the masters
 * in brand/screenshots/ and reports their real dimensions, which each <img>
 * sets so the layout never shifts while they load.
 *
 * To add one: drop the PNG in brand/screenshots/, map its file name to an id
 * here, and add `screenshots.shots.<id>` strings to every locale.
 */
const SHOT_IDS = {
  ss1: 'login',
  ss2: 'dashboard',
  ss3: 'analysis',
  ss4: 'comparison',
}

export const screenshots = shotManifest.map((shot) => ({
  id: SHOT_IDS[shot.name] ?? shot.name,
  src: asset(shot.file),
  width: shot.width,
  height: shot.height,
}))

/** The dashboard shot doubles as the hero preview — picked by id, not index. */
export const previewShot =
  screenshots.find((shot) => shot.id === 'dashboard') ?? screenshots[0]
