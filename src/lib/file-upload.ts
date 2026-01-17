import axios from 'axios'
import { client } from './api-client'

export type FileCategory =
  | 'exercise-image'
  | 'exercise-video'
  | 'course-image'
  | 'course-video'
  | 'profile-image'
  | 'news-image'

export interface PresignedUploadUrlRequest {
  fileName: string
  contentType: string
  category: FileCategory
}

export interface PresignedUploadUrlResponse {
  presignedUrl: string
  objectKey: string
  expiresIn: string
}

export interface PresignedDownloadUrlRequest {
  objectKey: string
  category: FileCategory
}

export interface PresignedDownloadUrlResponse {
  presignedUrl: string
  objectKey: string
  expiresIn: string
}

export interface DeleteFileRequest {
  objectKey: string
  category: FileCategory
}

/**
 * Step 1: Request a presigned URL for uploading a file
 */
export const requestPresignedUploadUrl = async (
  request: PresignedUploadUrlRequest
): Promise<PresignedUploadUrlResponse> => {
  const response = await client<PresignedUploadUrlResponse>({
    method: 'POST',
    url: '/api/files/presigned-upload-url',
    data: request,
  })
  return response.data
}

/**
 * Step 2: Upload file directly to MinIO using presigned URL
 * @param presignedUrl - The presigned URL from Step 1
 * @param file - The file to upload
 * @param contentType - The content type (must match what was specified in Step 1)
 * @param onProgress - Optional callback for upload progress
 */
export const uploadFileToMinIO = async (
  presignedUrl: string,
  file: File,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': contentType,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      }
    },
  })
}

/**
 * Request a presigned URL for downloading a file (for private files like videos)
 */
export const requestPresignedDownloadUrl = async (
  request: PresignedDownloadUrlRequest
): Promise<PresignedDownloadUrlResponse> => {
  const response = await client<PresignedDownloadUrlResponse>({
    method: 'POST',
    url: '/api/files/presigned-download-url',
    data: request,
  })
  return response.data
}

/**
 * Delete a file from MinIO
 */
export const deleteFile = async (request: DeleteFileRequest): Promise<void> => {
  await client({
    method: 'DELETE',
    url: '/api/files',
    data: request,
  })
}

/**
 * Get public image URL (no presigned URL needed for public images)
 */
export const getPublicImageUrl = (objectKey: string): string => {
  const baseUrl = import.meta.env.VITE_MINIO_PUBLIC_URL || 'http://localhost:9000/myrehab-images'
  return `${baseUrl}/${objectKey}`
}

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  category: FileCategory
): { valid: boolean; error?: string } => {
  const isImage = category.includes('image')
  const isVideo = category.includes('video')

  // Check file type
  if (isImage) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF hoặc WebP',
      }
    }
  } else if (isVideo) {
    const allowedVideoTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/webm',
      'video/x-matroska',
    ]
    if (!allowedVideoTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Chỉ chấp nhận file video định dạng MP4, AVI, MOV, WMV, WebM hoặc MKV',
      }
    }
  }

  // Check file size
  const maxSize = isImage ? 10 * 1024 * 1024 : 500 * 1024 * 1024 // 10MB for images, 500MB for videos
  if (file.size > maxSize) {
    const maxSizeMB = isImage ? 10 : 500
    return {
      valid: false,
      error: `Kích thước file vượt quá giới hạn ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}
