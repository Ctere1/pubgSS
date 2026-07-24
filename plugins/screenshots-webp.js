import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, parse } from 'node:path'
import sharp from 'sharp'

const VIRTUAL_ID = 'virtual:screenshots'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg'])

/**
 * Converts the screenshot masters in `dir` to WebP.
 *
 * The masters stay out of `public/` so they are never deployed: this plugin
 * emits `<outDir>/<name>.webp` at build time and serves the same paths from
 * memory in dev. Drop a new PNG into the source folder and it is picked up —
 * no manual conversion step, no committed derivatives.
 *
 * It also exposes `virtual:screenshots`, a manifest of
 * `{ name, file, width, height }` so the app can set intrinsic dimensions on
 * every <img> (which prevents layout shift) without hardcoding them.
 */
export function screenshotsWebp({
  dir = 'brand/screenshots',
  outDir = 'screenshots',
  quality = 85,
  effort = 6,
} = {}) {
  /** @type {Map<string, {buffer: Buffer, width: number, height: number}>} */
  const converted = new Map()
  let root = process.cwd()
  let base = '/'

  const sourceDir = () => join(root, dir)

  async function convertAll() {
    let entries = []
    try {
      entries = await readdir(sourceDir())
    } catch {
      this?.warn?.(`screenshots-webp: ${dir} not found`)
      return
    }

    const sources = entries.filter((f) => SOURCE_EXT.has(extname(f).toLowerCase())).sort()
    converted.clear()

    await Promise.all(
      sources.map(async (fileName) => {
        const name = parse(fileName).name
        const input = await readFile(join(sourceDir(), fileName))
        const pipeline = sharp(input)
        const { width, height } = await pipeline.metadata()
        const buffer = await pipeline.webp({ quality, effort }).toBuffer()
        converted.set(`${name}.webp`, { buffer, width, height })
      }),
    )
  }

  function manifest() {
    return [...converted.entries()].map(([file, { width, height }]) => ({
      name: parse(file).name,
      file: `${outDir}/${file}`,
      width,
      height,
    }))
  }

  return {
    name: 'screenshots-webp',

    configResolved(config) {
      root = config.root
      base = config.base
    },

    async buildStart() {
      await convertAll.call(this)
      const total = [...converted.values()].reduce((sum, v) => sum + v.buffer.length, 0)
      this.info?.(
        `screenshots-webp: ${converted.size} screenshot(s) → webp, ${(total / 1024).toFixed(0)} kB total`,
      )
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(manifest())}`
    },

    // Build: emit each WebP as an asset with a stable, unhashed path.
    generateBundle() {
      for (const [file, { buffer }] of converted) {
        this.emitFile({ type: 'asset', fileName: `${outDir}/${file}`, source: buffer })
      }
    },

    // Dev: serve the in-memory buffers at the same URLs the build produces.
    configureServer(server) {
      const prefix = `${base}${outDir}/`

      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url?.startsWith(prefix)) return next()

        const entry = converted.get(url.slice(prefix.length))
        if (!entry) return next()

        const etag = `"${createHash('sha1').update(entry.buffer).digest('hex').slice(0, 16)}"`
        if (req.headers['if-none-match'] === etag) {
          res.statusCode = 304
          return res.end()
        }

        res.setHeader('Content-Type', 'image/webp')
        res.setHeader('Content-Length', entry.buffer.length)
        res.setHeader('ETag', etag)
        res.end(entry.buffer)
      })

      // Re-convert and reload when a master changes or a new one is added.
      server.watcher.add(sourceDir())
      const onChange = async (file) => {
        if (!file.startsWith(sourceDir()) || !SOURCE_EXT.has(extname(file).toLowerCase())) return
        await convertAll()
        server.moduleGraph.invalidateModule(server.moduleGraph.getModuleById(RESOLVED_ID))
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
