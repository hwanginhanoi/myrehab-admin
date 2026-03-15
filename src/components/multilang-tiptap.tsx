import { Tiptap } from '@/components/tiptap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MultilangValue } from '@/components/multilang-input'
import { useMultilangLang } from '@/context/multilang-lang-context'

type MultilangTiptapProps = {
  value: MultilangValue
  onChange: (value: MultilangValue) => void
  placeholder?: { vi?: string; en?: string }
  disabled?: boolean
  errors?: { vi?: string; en?: string }
}

export function MultilangTiptap({
  value,
  onChange,
  placeholder,
  disabled,
  errors,
}: MultilangTiptapProps) {
  const { lang, setLang } = useMultilangLang()

  return (
    <Tabs value={lang} onValueChange={(v) => setLang(v as 'vi' | 'en')} className="gap-1">
      <TabsList className="h-7">
        <TabsTrigger value="vi" className="text-xs px-2 py-0.5 relative">
          VI
          {errors?.vi && lang !== 'vi' && (
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          )}
        </TabsTrigger>
        <TabsTrigger value="en" className="text-xs px-2 py-0.5 relative">
          EN
          {errors?.en && lang !== 'en' && (
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="vi" className="mt-0">
        <Tiptap
          value={value.vi}
          onChange={(v) => onChange({ ...value, vi: v })}
          placeholder={placeholder?.vi ?? 'Nhập tiếng Việt...'}
          disabled={disabled}
        />
      </TabsContent>
      <TabsContent value="en" className="mt-0">
        <Tiptap
          value={value.en}
          onChange={(v) => onChange({ ...value, en: v })}
          placeholder={placeholder?.en ?? 'Enter in English...'}
          disabled={disabled}
        />
      </TabsContent>
    </Tabs>
  )
}
