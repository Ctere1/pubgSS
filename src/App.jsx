import { useTranslation } from 'react-i18next'
import { Contact } from './components/Contact.jsx'
import { Features } from './components/Features.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { Hero } from './components/Hero.jsx'
import { Installation } from './components/Installation.jsx'
import { Screenshots } from './components/Screenshots.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const { theme, toggle } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-btn focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-btn-fg"
      >
        {t('a11y.skip')}
      </a>

      <Header theme={theme} onToggleTheme={toggle} />

      <main id="main">
        <Hero />
        <Features />
        <Installation />
        <Screenshots />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
