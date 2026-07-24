/**
 * Single place where icons are named. Icons come from Iconify sets
 * (lucide + simple-icons) and are compiled into the bundle by unplugin-icons,
 * so there is no icon font and no runtime request.
 */
import ArrowLeftRight from '~icons/lucide/arrow-left-right'
import ArrowRight from '~icons/lucide/arrow-right'
import Braces from '~icons/lucide/braces'
import Download from '~icons/lucide/download'
import Expand from '~icons/lucide/maximize-2'
import FileText from '~icons/lucide/file-text'
import Globe from '~icons/lucide/globe'
import Heart from '~icons/lucide/heart'
import Mail from '~icons/lucide/mail'
import Moon from '~icons/lucide/moon'
import Sun from '~icons/lucide/sun'
import X from '~icons/lucide/x'
import Github from '~icons/simple-icons/github'

export {
  ArrowRight as ArrowIcon,
  X as CloseIcon,
  Download as DownloadIcon,
  Expand as ExpandIcon,
  Github as GitHubIcon,
  Globe as GlobeIcon,
  Heart as HeartIcon,
  Mail as MailIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
}

export const featureIcons = {
  json: Braces,
  pdf: FileText,
  compare: ArrowLeftRight,
}
