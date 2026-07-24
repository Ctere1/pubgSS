import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import { screenshotsWebp } from './plugins/screenshots-webp.js'

// Served from https://ctere1.github.io/pubgSS/ — the sub-path must be baked in.
export default defineConfig({
  base: '/pubgSS/',
  plugins: [
    react(),
    tailwindcss(),
    // brand/screenshots/*.png → dist/screenshots/*.webp, plus a manifest with
    // intrinsic sizes exposed as `virtual:screenshots`.
    screenshotsWebp(),
    // Iconify sets compiled to React components at build time (no runtime
    // fetch): `import IconX from '~icons/lucide/x'`. Only used icons ship.
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
})
