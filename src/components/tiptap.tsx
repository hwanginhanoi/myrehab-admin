'use client'

import { useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ImagePlus,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { validateFile } from '@/lib/file-upload'
import { toast } from 'sonner'

interface TiptapProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function Tiptap({
  value,
  onChange,
  disabled = false,
  placeholder = 'Nhập nội dung...',
  className
}: TiptapProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true, // Allow base64 for temporary storage before upload
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: value || '<p></p>',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // Return empty string if editor only contains empty paragraph
      if (editor.isEmpty) {
        onChange('')
      } else {
        onChange(html)
      }
    },
  })

  // Sync external value changes to editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [value, editor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    // Validate file
    const validation = validateFile(file, 'news-image')
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    // Convert to base64 and insert into editor
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      editor.chain().focus().setImage({ src: base64String }).run()
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className={cn('tiptap-wrapper', className)}>
      {/* Toolbar */}
      <div className='tiptap-toolbar flex flex-wrap items-center gap-1 border-b border-input bg-muted/30 p-2 rounded-t-md'>
        {/* Bold */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('bold') && 'bg-accent'
          )}
          title='Bold'
        >
          <Bold className='h-4 w-4' />
        </Button>

        {/* Italic */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('italic') && 'bg-accent'
          )}
          title='Italic'
        >
          <Italic className='h-4 w-4' />
        </Button>

        {/* Underline */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('underline') && 'bg-accent'
          )}
          title='Underline'
        >
          <UnderlineIcon className='h-4 w-4' />
        </Button>

        {/* Strikethrough */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('strike') && 'bg-accent'
          )}
          title='Strikethrough'
        >
          <Strikethrough className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Heading 1 */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('heading', { level: 1 }) && 'bg-accent'
          )}
          title='Heading 1'
        >
          <Heading1 className='h-4 w-4' />
        </Button>

        {/* Heading 2 */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('heading', { level: 2 }) && 'bg-accent'
          )}
          title='Heading 2'
        >
          <Heading2 className='h-4 w-4' />
        </Button>

        {/* Heading 3 */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('heading', { level: 3 }) && 'bg-accent'
          )}
          title='Heading 3'
        >
          <Heading3 className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Bullet List */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('bulletList') && 'bg-accent'
          )}
          title='Bullet List'
        >
          <List className='h-4 w-4' />
        </Button>

        {/* Ordered List */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive('orderedList') && 'bg-accent'
          )}
          title='Ordered List'
        >
          <ListOrdered className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Align Left */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive({ textAlign: 'left' }) && 'bg-accent'
          )}
          title='Align Left'
        >
          <AlignLeft className='h-4 w-4' />
        </Button>

        {/* Align Center */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive({ textAlign: 'center' }) && 'bg-accent'
          )}
          title='Align Center'
        >
          <AlignCenter className='h-4 w-4' />
        </Button>

        {/* Align Right */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive({ textAlign: 'right' }) && 'bg-accent'
          )}
          title='Align Right'
        >
          <AlignRight className='h-4 w-4' />
        </Button>

        {/* Align Justify */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          disabled={disabled}
          className={cn(
            'h-8 px-2',
            editor.isActive({ textAlign: 'justify' }) && 'bg-accent'
          )}
          title='Align Justify'
        >
          <AlignJustify className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Text Color */}
        <div className='relative'>
          <input
            type='color'
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            disabled={disabled}
            className='absolute opacity-0 w-8 h-8 cursor-pointer'
            title='Text Color'
          />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={disabled}
            className='h-8 px-2 pointer-events-none'
            title='Text Color'
          >
            <Palette className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Image Upload */}
        <input
          ref={imageInputRef}
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={handleImageSelect}
          className='hidden'
        />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => imageInputRef.current?.click()}
          disabled={disabled}
          className='h-8 px-2'
          title='Upload Image'
        >
          <ImagePlus className='h-4 w-4' />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={cn(
          'tiptap-editor border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-[150px] w-full rounded-b-md border border-t-0 bg-transparent shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  )
}
