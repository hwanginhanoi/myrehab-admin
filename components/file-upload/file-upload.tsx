'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { MediaViewerDialog } from '@/components/ui/media-viewer-dialog';
import { Upload, X, FileImage, FileVideo, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import Image from 'next/image';
import { generatePresignedUploadUrl } from '@/api/api/fileUploadController/generatePresignedUploadUrl';
import { generateVideoViewingUrl } from '@/api/api/fileUploadController/generateVideoViewingUrl';
import { PresignedUrlRequest } from '@/api/types/PresignedUrlRequest';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadCompleteAction: (fileUrl: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  onVideoDurationExtracted?: (durationMinutes: number) => void;
  acceptedTypes: string[];
  fileType: 'image' | 'video';
  maxFileSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

interface UploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  uploadUrl: string | null;
  fileUrl: string | null;
  videoViewingUrl: string | null; // For videos, this will be the presigned viewing URL
  error: string | null;
  completed: boolean;
}

export function FileUpload({
  onUploadCompleteAction,
  onUploadStart,
  onUploadError,
  onVideoDurationExtracted,
  acceptedTypes,
  fileType,
  maxFileSize = 50, // Default 50MB
  className,
  disabled = false,
}: FileUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    uploading: false,
    progress: 0,
    uploadUrl: null,
    fileUrl: null,
    videoViewingUrl: null,
    error: null,
    completed: false,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to get video viewing URL
  const getVideoViewingUrl = useCallback(async (fileUrl: string): Promise<string | null> => {
    try {
      const viewingUrl = await generateVideoViewingUrl({
        fileUrl,
        durationMinutes: 5, // 5 minutes expiry as mentioned in the docs
      });
      return viewingUrl;
    } catch (error) {
      console.error('Failed to generate video viewing URL:', error);
      toast.error('Failed to load video preview');
      return null;
    }
  }, []);

  // Effect to generate video viewing URL when needed
  useEffect(() => {
    if (uploadState.completed && fileType === 'video' && uploadState.fileUrl && !uploadState.videoViewingUrl) {
      getVideoViewingUrl(uploadState.fileUrl).then((viewingUrl) => {
        if (viewingUrl) {
          setUploadState(prev => ({
            ...prev,
            videoViewingUrl: viewingUrl,
          }));
        }
      });
    }
  }, [uploadState.completed, uploadState.fileUrl, uploadState.videoViewingUrl, fileType, getVideoViewingUrl]);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size too large. Maximum size: ${maxFileSize}MB`;
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const extractVideoDuration = useCallback(async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const durationSeconds = video.duration;
        const durationMinutes = Math.ceil(durationSeconds / 60); // Round up to nearest minute
        resolve(durationMinutes);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadToS3 = useCallback(async (file: File, uploadUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState(prev => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Upload response status:', xhr.status);
        console.log('Upload response text:', xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText || 'Unknown error'}`));
        }
      });

      xhr.addEventListener('error', (event) => {
        console.error('Upload error event:', event);
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      console.log('Starting upload to:', uploadUrl);
      console.log('File details:', { name: file.name, type: file.type, size: file.size });

      xhr.open('PUT', uploadUrl);

      // Don't set Content-Type header - let the browser set it automatically for S3
      // Some S3 configurations are sensitive to the Content-Type header

      xhr.send(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }));
      onUploadError?.(validationError);
      toast.error('File validation failed', { description: validationError });
      return;
    }

    setUploadState({
      file,
      uploading: true,
      progress: 0,
      uploadUrl: null,
      fileUrl: null,
      videoViewingUrl: null,
      error: null,
      completed: false,
    });

    onUploadStart?.();

    // Extract video duration if it's a video file
    if (fileType === 'video' && onVideoDurationExtracted) {
      try {
        const durationMinutes = await extractVideoDuration(file);
        onVideoDurationExtracted(durationMinutes);
        toast.success('Video duration extracted', {
          description: `Duration: ${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''}`
        });
      } catch (error) {
        console.error('Failed to extract video duration:', error);
        toast.warning('Could not extract video duration', {
          description: 'Please enter the duration manually'
        });
      }
    }

    try {
      // Generate presigned URL
      const presignedRequest: PresignedUrlRequest = {
        fileName: file.name,
        contentType: file.type,
        fileType: fileType,
      };

      console.log('Requesting presigned URL with:', presignedRequest);
      const presignedResponse = await generatePresignedUploadUrl(presignedRequest);
      console.log('Presigned URL response:', presignedResponse);

      if (!presignedResponse.uploadUrl || !presignedResponse.fileUrl) {
        throw new Error('Failed to get upload URL from server');
      }

      setUploadState(prev => ({
        ...prev,
        uploadUrl: presignedResponse.uploadUrl!,
        fileUrl: presignedResponse.fileUrl!,
      }));

      // Upload to S3
      await uploadToS3(file, presignedResponse.uploadUrl);

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        completed: true,
      }));

      onUploadCompleteAction(presignedResponse.fileUrl!);
      toast.success('File uploaded successfully!', {
        description: `${file.name} has been uploaded.`
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
        completed: false,
      }));
      onUploadError?.(errorMessage);
      toast.error('Upload failed', { description: errorMessage });
    }
  }, [validateFile, fileType, onUploadStart, onUploadCompleteAction, onUploadError, onVideoDurationExtracted, extractVideoDuration, uploadToS3]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleClear = useCallback(() => {
    setUploadState({
      file: null,
      uploading: false,
      progress: 0,
      uploadUrl: null,
      fileUrl: null,
      videoViewingUrl: null,
      error: null,
      completed: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePreviewOpen = useCallback(async () => {
    // For videos, refresh the viewing URL when opening the modal
    // since URLs expire after 5 minutes
    if (fileType === 'video' && uploadState.fileUrl) {
      const freshViewingUrl = await getVideoViewingUrl(uploadState.fileUrl);
      if (freshViewingUrl) {
        setUploadState(prev => ({
          ...prev,
          videoViewingUrl: freshViewingUrl,
        }));
      }
    }
    setPreviewOpen(true);
  }, [fileType, uploadState.fileUrl, getVideoViewingUrl]);

  const getFileIcon = () => {
    if (fileType === 'image') {
      return <FileImage className="h-8 w-8 text-muted-foreground" />;
    }
    return <FileVideo className="h-8 w-8 text-muted-foreground" />;
  };

  const getAcceptString = () => acceptedTypes.join(',');

  return (
    <div className={cn('w-full max-w-md', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploadState.uploading}
      />

      {!uploadState.file ? (
        <Card
          className={cn(
            'border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer min-h-[200px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={!disabled ? handleUploadClick : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          onDragOver={!disabled ? handleDragOver : undefined}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[188px]">
            <div className="mb-4">
              {getFileIcon()}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">
                Upload {fileType === 'image' ? 'Image' : 'Video'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your {fileType} here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted formats: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum size: {maxFileSize}MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={disabled}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 min-h-[200px]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon()}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate" title={uploadState.file.name}>
                    {uploadState.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadState.completed && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {uploadState.error && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={uploadState.uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {uploadState.uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadState.progress}%</span>
                </div>
                <Progress value={uploadState.progress} className="w-full" />
              </div>
            )}

            {uploadState.completed && (
              <div className="space-y-3">
                <div className="text-sm text-green-600 font-medium">
                  ✓ Upload completed successfully
                </div>

                {/* Preview Section */}
                {uploadState.fileUrl && (
                  <div className="space-y-2 max-h-32">
                    <span className="text-sm font-medium">Preview:</span>

                    {fileType === 'image' ? (
                      <div
                        className="relative w-full h-20 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handlePreviewOpen}
                      >
                        <Image
                          src={uploadState.fileUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {uploadState.videoViewingUrl ? (
                          <div
                            className="relative w-full h-20 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handlePreviewOpen}
                          >
                            <video
                              src={uploadState.videoViewingUrl}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 rounded-full p-2">
                                <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-20 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Loading video preview...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {uploadState.error && (
              <div className="text-sm text-red-600">
                ✗ {uploadState.error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <MediaViewerDialog
        open={previewOpen}
        onOpenChangeAction={setPreviewOpen}
        fileType={fileType}
        fileName={uploadState.file?.name || ''}
        imageUrl={fileType === 'image' ? uploadState.fileUrl || undefined : undefined}
        videoUrl={fileType === 'video' ? uploadState.videoViewingUrl || undefined : undefined}
      />
    </div>
  );
}