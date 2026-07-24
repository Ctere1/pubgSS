import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ko from './locales/ko.json'
import tr from './locales/tr.json'

/** Order shown in the language picker; labels are in each language itself. */
export const languages = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ko', label: '한국어' },
]

const resources = { en, tr, de, fr, es, ko }

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Object.fromEntries(
      Object.entries(resources).map(([code, translation]) => [code, { translation }]),
    ),
    supportedLngs: languages.map((l) => l.code),
    fallbackLng: 'en',
    // Map regional codes such as `de-AT` onto the base language.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pubgss-language',
    },
  })

const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng
}

syncHtmlLang(i18n.resolvedLanguage)
i18n.on('languageChanged', syncHtmlLang)

export default i18n
