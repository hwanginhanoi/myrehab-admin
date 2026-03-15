import { useState } from 'react'
import { Tiptap } from '@/components/tiptap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MultilangValue } from '@/components/multilang-input'

type MultilangTiptapProps = {
  value: MultilangValue
  onChange: (value: MultilangValue) => void
  placeholder?: { vi?: string; en?: string }
  disabled?: boolean
}

export function MultilangTiptap({
  value,
  onChange,
  placeholder,
  disabled,
}: MultilangTiptapProps) {
  const [tab, setTab] = useState('vi')

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-1">
      <TabsList className="h-7">
        <TabsTrigger value="vi" className="text-xs px-2 py-0.5">
          VI
        </TabsTrigger>
        <TabsTrigger value="en" className="text-xs px-2 py-0.5">
          EN
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
