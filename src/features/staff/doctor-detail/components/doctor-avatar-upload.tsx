import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Camera, X, Loader2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import {
  validateFile,
  requestPresignedUploadUrl,
  uploadFileToMinIO,
  getPublicImageUrl,
} from '@/lib/file-upload'

export interface DoctorAvatarUploadRef {
  upload: () => Promise<string | null>
  hasFile: () => boolean
}

interface DoctorAvatarUploadProps {
  value?: string
  onChange: (objectKey: string) => void
  disabled?: boolean
}

export const DoctorAvatarUpload = forwardRef<
  DoctorAvatarUploadRef,
  DoctorAvatarUploadProps
>(function DoctorAvatarUpload({ value, onChange, disabled }, ref) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentImage = preview ?? (value ? getPublicImageUrl(value) : null)

  useImperativeHandle(ref, () => ({
    upload: async () => {
      if (!file) return null
      try {
        setUploading(true)
        const { presignedUrl, objectKey } = await requestPresignedUploadUrl({
          fileName: file.name,
          contentType: file.type,
          category: 'profile-image',
        })
        await uploadFileToMinIO(presignedUrl, file, file.type)
        return objectKey
      } catch {
        toast.error('Không thể tải ảnh lên')
        return null
      } finally {
        setUploading(false)
      }
    },
    hasFile: () => !!file,
  }))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    const validation = validateFile(selected, 'profile-image')
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
    onChange('')
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Circle avatar */}
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled || uploading}
          className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : currentImage ? (
            <>
              <img
                src={currentImage}
                alt="Ảnh đại diện"
                className="h-full w-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </>
          ) : (
            <>
              <UserRound className="h-10 w-10 text-muted-foreground" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
            </>
          )}
        </button>

        {/* Remove button */}
        {currentImage && !disabled && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-gray-300 focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {disabled ? 'Ảnh đại diện' : 'Nhấn để thay đổi ảnh'}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  )
})
