import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
}

export function MultilangInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: MultilangInputProps) {
  const [tab, setTab] = useState('vi')

  return (
    <Tabs value={tab} onValueChange={setTab} className={cn('gap-1', className)}>
      <TabsList className="h-7">
        <TabsTrigger value="vi" className="text-xs px-2 py-0.5">
          VI
        </TabsTrigger>
        <TabsTrigger value="en" className="text-xs px-2 py-0.5">
          EN
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
}

export function MultilangTextarea({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  textareaClassName,
}: MultilangTextareaProps) {
  const [tab, setTab] = useState('vi')

  return (
    <Tabs value={tab} onValueChange={setTab} className={cn('gap-1', className)}>
      <TabsList className="h-7">
        <TabsTrigger value="vi" className="text-xs px-2 py-0.5">
          VI
        </TabsTrigger>
        <TabsTrigger value="en" className="text-xs px-2 py-0.5">
          EN
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
