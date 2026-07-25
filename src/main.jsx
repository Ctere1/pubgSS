import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter, self-hosted and bundled — no render-blocking request to a third party.
// `opsz` is the optical-size axis the design was set with; every subset is
// unicode-range scoped, so a visitor only downloads the one their text needs.
import '@fontsource-variable/inter/opsz.css'
import App from './App.jsx'
import './i18n.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
