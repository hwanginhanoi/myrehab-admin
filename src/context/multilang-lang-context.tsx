import { createContext, useContext, useState } from 'react'

type Lang = 'vi' | 'en'

type MultilangLangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const MultilangLangContext = createContext<MultilangLangContextValue | null>(null)

export function MultilangLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('vi')

  return (
    <MultilangLangContext value={{ lang, setLang }}>
      {children}
    </MultilangLangContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMultilangLang(): MultilangLangContextValue {
  const ctx = useContext(MultilangLangContext)
  // Fall back to a local no-op when no provider is present (shouldn't happen in practice)
  if (!ctx) {
    return { lang: 'vi', setLang: () => {} }
  }
  return ctx
}
