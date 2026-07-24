/**
 * Generates public/og-card.png — the 1200x630 image social platforms show when
 * the site is shared.
 *
 * Run manually after changing the branding:
 *   node scripts/make-og-card.mjs
 *
 * Unlike the screenshots (converted on every build by plugins/screenshots-webp.js)
 * the result is committed: rendering text depends on the fonts installed on the
 * machine, and the GitHub Actions runner does not have the same ones.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))

const ICON_SIZE = 200
const FONT = 'Helvetica Neue, Helvetica, Arial, DejaVu Sans, sans-serif'

const icon = await sharp(`${root}brand/app-icon-1024.png`)
  .resize(ICON_SIZE, ICON_SIZE)
  .png()
  .toBuffer()

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="6%" r="64%">
      <stop offset="0%" stop-color="#4cc4f5" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#4cc4f5" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b0f14"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="4" fill="#4cc4f5" fill-opacity="0.6"/>
  <text x="600" y="404" text-anchor="middle" font-family="${FONT}" font-size="66" font-weight="600" fill="#e9eef4">Stream Sniping Detector</text>
  <text x="600" y="458" text-anchor="middle" font-family="${FONT}" font-size="29" fill="#a4b2c0">PUBG match analysis · Windows desktop app</text>
  <text x="600" y="556" text-anchor="middle" font-family="${FONT}" font-size="22" fill="#6d7d8c" letter-spacing="1.6">CTERE1.GITHUB.IO/PUBGSS</text>
</svg>`

const card = await sharp(Buffer.from(svg))
  .composite([{ input: icon, top: 104, left: (1200 - ICON_SIZE) / 2 }])
  .png({ compressionLevel: 9 })
  .toBuffer()

const out = `${root}public/og-card.png`
await writeFile(out, card)

const { width, height, size } = await sharp(card).metadata()
console.log(`og-card.png → ${width}x${height}, ${(size / 1024).toFixed(0)} kB`)
