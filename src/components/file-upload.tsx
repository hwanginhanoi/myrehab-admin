'use client'

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Upload, X, Loader2, FileVideo, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  type FileCategory,
  validateFile,
  requestPresignedUploadUrl,
  uploadFileToMinIO,
  requestPresignedDownloadUrl,
  getPublicImageUrl,
} from '@/lib/file-upload'
import { toast } from 'sonner'

interface FileUploadProps {
  category: FileCategory
  value?: string // objectKey
  onChange: (objectKey: string) => void
  onVideoDurationChange?: (durationMinutes: number) => void
  disabled?: boolean
  className?: string
  accept?: string
  label?: string
}

export interface FileUploadRef {
  upload: () => Promise<string | null>
  hasFile: () => boolean
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  function FileUpload({ category, value, onChange, onVideoDurationChange, disabled, className, accept, label }, ref) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<string>('')
    const [backendPreviewUrl, setBackendPreviewUrl] = useState<string | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [previewError, setPreviewError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const isImage = category.includes('image')
    const isVideo = category.includes('video')

    // Auto-detect accept type if not provided
    const acceptType =
      accept ||
      (isImage
        ? 'image/jpeg,image/png,image/gif,image/webp'
        : 'video/mp4,video/avi,video/quicktime,video/x-ms-wmv,video/webm,video/x-matroska')

    // Expose upload method to parent via ref
    useImperativeHandle(ref, () => ({
      upload: async () => {
        if (!file) return null

        try {
          setUploading(true)
          setProgress(0)

          // Step 1: Request presigned upload URL
          setUploadStatus('Đang chuẩn bị...')
          const { presignedUrl, objectKey } = await requestPresignedUploadUrl({
            fileName: file.name,
            contentType: file.type,
            category,
          })

          // Step 2: Upload file to MinIO
          setUploadStatus('Đang tải lên...')
          await uploadFileToMinIO(presignedUrl, file, file.type, (uploadProgress) => {
            setProgress(uploadProgress)
          })

          setUploadStatus('Hoàn thành!')
          return objectKey
        } catch (error) {
          console.error('Upload error:', error)
          throw error
        } finally {
          setUploading(false)
          setProgress(0)
          setUploadStatus('')
        }
      },
      hasFile: () => !!file,
    }))

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (!selectedFile) return

      // Validate file
      const validation = validateFile(selectedFile, category)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      setFile(selectedFile)

      // Create preview for images
      if (isImage) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else if (isVideo) {
        // Create video preview URL and extract duration
        const videoUrl = URL.createObjectURL(selectedFile)
        setPreview(videoUrl)

        // Extract video duration
        const videoElement = document.createElement('video')
        videoElement.preload = 'metadata'
        videoElement.onloadedmetadata = () => {
          URL.revokeObjectURL(videoElement.src)
          const durationInSeconds = videoElement.duration
          const durationInMinutes = Math.ceil(durationInSeconds / 60)

          if (onVideoDurationChange) {
            onVideoDurationChange(durationInMinutes)
          }
        }
        videoElement.src = videoUrl
      }

      // Clear the value since we haven't uploaded yet
      onChange('')
    }

    const handleRemove = () => {
      setFile(null)
      setPreview(null)
      onChange('')
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }

    const handleBrowseClick = () => {
      if (!disabled) {
        inputRef.current?.click()
      }
    }

    // Fetch and generate preview URL when value is provided
    useEffect(() => {
      if (value && !file && !preview) {
        const fetchPreview = async () => {
          try {
            setPreviewLoading(true)
            setPreviewError(null)

            if (isImage) {
              // For images, use public URL directly (no presigned URL needed)
              // Check if value is already a full URL
              const url = value.startsWith('http://') || value.startsWith('https://')
                ? value
                : getPublicImageUrl(value)
              setBackendPreviewUrl(url)
            } else if (isVideo) {
              // For videos, request presigned URL for security
              const response = await requestPresignedDownloadUrl({
                objectKey: value,
                category,
              })
              setBackendPreviewUrl(response.presignedUrl)
            }
          } catch (error) {
            console.error('Failed to fetch preview URL:', error)
            setPreviewError('Không thể tải xem trước')
          } finally {
            setPreviewLoading(false)
          }
        }

        fetchPreview()
      }
    }, [value, file, preview, isImage, isVideo, category])

    return (
      <div className={cn('space-y-3', className)}>
        {label && <div className='text-sm font-medium'>{label}</div>}

        {/* File Input (hidden) */}
        <input
          ref={inputRef}
          type='file'
          accept={acceptType}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className='hidden'
        />

        {/* Upload Area - 16:9 Aspect Ratio */}
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          <div className='absolute inset-0'>
            {!file && !value && (
              <div
                onClick={handleBrowseClick}
                className={cn(
                  'h-full w-full border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors',
                  'hover:border-primary/50 hover:bg-accent/50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className='flex flex-col items-center gap-2'>
                  {isImage ? (
                    <ImageIcon className='h-10 w-10 text-muted-foreground' />
                  ) : (
                    <FileVideo className='h-10 w-10 text-muted-foreground' />
                  )}
                  <div className='text-sm text-muted-foreground'>
                    {isImage ? 'Click để chọn ảnh' : 'Click để chọn video'}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {isImage
                      ? 'JPEG, PNG, GIF, WebP (tối đa 10MB)'
                      : 'MP4, AVI, MOV, WMV, WebM, MKV (tối đa 500MB)'}
                  </div>
                </div>
              </div>
            )}

            {/* Preview with 16:9 container */}
            {(file || value) && (
              <div className='h-full w-full relative rounded-lg overflow-hidden border bg-black'>
                {isImage && (preview || backendPreviewUrl) && (
                  <img
                    src={preview || backendPreviewUrl || ''}
                    alt='Preview'
                    className='h-full w-full object-cover'
                  />
                )}
                {isVideo && (preview || backendPreviewUrl) && (
                  <video
                    src={preview || backendPreviewUrl || ''}
                    className='h-full w-full object-cover'
                    controls
                  />
                )}
                {value && !preview && !backendPreviewUrl && !previewLoading && (
                  <div className='h-full w-full flex items-center justify-center'>
                    <div className='text-center text-white'>
                      {isImage ? (
                        <ImageIcon className='h-10 w-10 mx-auto mb-2 opacity-50' />
                      ) : (
                        <FileVideo className='h-10 w-10 mx-auto mb-2 opacity-50' />
                      )}
                      <div className='text-sm opacity-70'>File đã tải lên</div>
                      <div className='text-xs opacity-50 mt-1 px-4 break-all'>
                        {value}
                      </div>
                    </div>
                  </div>
                )}
                {previewLoading && (
                  <div className='h-full w-full flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <Loader2 className='h-10 w-10 mx-auto mb-2 animate-spin opacity-50' />
                      <div className='text-sm opacity-70'>Đang tải xem trước...</div>
                    </div>
                  </div>
                )}
                {previewError && (
                  <div className='h-full w-full flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <FileVideo className='h-10 w-10 mx-auto mb-2 opacity-50' />
                      <div className='text-sm opacity-70'>{previewError}</div>
                      <div className='text-xs opacity-50 mt-1 px-4 break-all'>
                        {value}
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove button overlay */}
                {!uploading && !disabled && (
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={handleRemove}
                    className='absolute top-2 right-2'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}

                {/* Upload progress overlay */}
                {uploading && (
                  <div className='absolute inset-0 bg-black/70 flex items-center justify-center'>
                    <div className='w-3/4 space-y-3'>
                      <div className='flex items-center justify-center gap-2 text-white'>
                        <Loader2 className='h-5 w-5 animate-spin' />
                        <span className='text-sm font-medium'>{uploadStatus}</span>
                      </div>
                      <div className='space-y-1'>
                        <Progress value={progress} className='h-2' />
                        <div className='text-center text-xs text-white/70'>
                          {progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* File info below preview - keeps consistent height */}
        <div className='h-6 flex items-center justify-between text-sm text-muted-foreground'>
          {file && (
            <>
              <span className='truncate'>{file.name}</span>
              <span className='ml-2 flex-shrink-0'>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </>
          )}
        </div>
      </div>
    )
  }
)
