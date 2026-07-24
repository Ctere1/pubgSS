import { useTranslation } from 'react-i18next'

/**
 * Caption and alt text for a screenshot. Keeps the `screenshots.shots.<id>.*`
 * key shape in one place instead of spelling it out at every call site.
 */
export function useShotText(shot) {
  const { t } = useTranslation()

  return {
    caption: t(`screenshots.shots.${shot.id}.caption`),
    alt: t(`screenshots.shots.${shot.id}.alt`),
  }
}
