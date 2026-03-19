import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useMultilangLang } from '@/context/multilang-lang-context'

export type MultilangValue = {
  vi: string
  en: string
}

type MultilangInputProps = {
  value: MultilangValue
  onChange: (value: MultilangValue) => void
  placeholder?: { vi?: string; en?: string }
  disabled?: boolean
  className?: string
  errors?: { vi?: string; en?: string }
}

export function MultilangInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  errors,
}: MultilangInputProps) {
  const { lang, setLang } = useMultilangLang()

  return (
    <Tabs value={lang} onValueChange={(v) => setLang(v as 'vi' | 'en')} className={cn('gap-1', className)}>
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
        <Input
          value={value.vi}
          onChange={(e) => onChange({ ...value, vi: e.target.value })}
          placeholder={placeholder?.vi ?? 'Nhập tiếng Việt...'}
          disabled={disabled}
        />
      </TabsContent>
      <TabsContent value="en" className="mt-0">
        <Input
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder={placeholder?.en ?? 'Enter in English...'}
          disabled={disabled}
        />
      </TabsContent>
    </Tabs>
  )
}

type MultilangTextareaProps = {
  value: MultilangValue
  onChange: (value: MultilangValue) => void
  placeholder?: { vi?: string; en?: string }
  disabled?: boolean
  className?: string
  textareaClassName?: string
  errors?: { vi?: string; en?: string }
}

export function MultilangTextarea({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  textareaClassName,
  errors,
}: MultilangTextareaProps) {
  const { lang, setLang } = useMultilangLang()

  return (
    <Tabs value={lang} onValueChange={(v) => setLang(v as 'vi' | 'en')} className={cn('gap-1', className)}>
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
        <Textarea
          value={value.vi}
          onChange={(e) => onChange({ ...value, vi: e.target.value })}
          placeholder={placeholder?.vi ?? 'Nhập tiếng Việt...'}
          disabled={disabled}
          className={textareaClassName}
        />
      </TabsContent>
      <TabsContent value="en" className="mt-0">
        <Textarea
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder={placeholder?.en ?? 'Enter in English...'}
          disabled={disabled}
          className={textareaClassName}
        />
      </TabsContent>
    </Tabs>
  )
}
