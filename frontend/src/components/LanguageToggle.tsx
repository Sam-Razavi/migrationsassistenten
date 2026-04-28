import { useLanguage } from '../i18n'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'sv' ? 'EN' : 'SV'}
    </button>
  )
}
