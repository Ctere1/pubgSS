import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

// Served from https://ctere1.github.io/pubgSS/ — the sub-path must be baked in.
export default defineConfig({
  base: '/pubgSS/',
  plugins: [
    react(),
    tailwindcss(),
    // Iconify sets compiled to React components at build time (no runtime
    // fetch): `import IconX from '~icons/lucide/x'`. Only used icons ship.
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
})
