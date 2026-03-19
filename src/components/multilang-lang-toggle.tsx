import { useMultilangLang } from '@/context/multilang-lang-context'
import { cn } from '@/lib/utils'

type MultilangLangToggleProps = {
  className?: string
  lang?: 'vi' | 'en'
  onLangChange?: (lang: 'vi' | 'en') => void
}

export function MultilangLangToggle({ className, lang: langProp, onLangChange }: MultilangLangToggleProps) {
  const ctx = useMultilangLang()
  const lang = langProp ?? ctx.lang
  const setLang = onLangChange ?? ctx.setLang

  return (
    <div className={cn('flex items-center gap-1 rounded-md border p-0.5 w-fit', className)}>
      <button
        type="button"
        onClick={() => setLang('vi')}
        className={cn(
          'rounded px-2.5 py-1 text-xs font-medium transition-colors',
          lang === 'vi'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'rounded px-2.5 py-1 text-xs font-medium transition-colors',
          lang === 'en'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        EN
      </button>
    </div>
  )
}
