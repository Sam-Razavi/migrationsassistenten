import { useLanguage } from '../i18n'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()

  return (
    <button
      onClick={toggle}
      className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'sv' ? 'EN' : 'SV'}
    </button>
  )
}
