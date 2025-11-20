'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { MediaViewerDialog } from '@/components/ui/media-viewer-dialog';
import { Upload, X, FileImage, AlertCircle, CheckCircle, Eye, InfoIcon } from 'lucide-react';
import Image from 'next/image';
import { generatePresignedUploadUrl } from '@/api/api/fileUploadController/generatePresignedUploadUrl';
import { generateVideoViewingUrl } from '@/api/api/fileUploadController/generateVideoViewingUrl';
import { PresignedUrlRequest } from '@/api/types/PresignedUrlRequest';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onUploadCompleteAction: (fileUrl: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  onVideoDurationExtracted?: (durationMinutes: number) => void;
  acceptedTypes: string[];
  fileType: 'image' | 'video';
  category?: 'exercise' | 'course' | 'news' | 'banner' | 'profile'; // Required for images
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
  category,
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
        ...(fileType === 'image' && category ? { category } : {}),
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

  const getAcceptString = () => acceptedTypes.join(',');

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploadState.uploading}
      />

      <Card className="overflow-hidden">
        <CardContent className="px-4">
          {!uploadState.file ? (
            // Empty state - upload area
            <div
              className={cn(
                'border-2 border-dashed border-muted-foreground/25 rounded-lg transition-colors',
                'w-full aspect-video', // 16:9 aspect ratio
                'flex flex-col items-center justify-center gap-3 cursor-pointer',
                !disabled && 'hover:border-muted-foreground/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={!disabled ? handleUploadClick : undefined}
              onDrop={!disabled ? handleDrop : undefined}
              onDragOver={!disabled ? handleDragOver : undefined}
            >
              {/* Upload icon */}
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>

              {/* Upload text */}
              <div className="space-y-1 text-center">
                <h3 className="text-base font-semibold">
                  Upload Cover {fileType === 'image' ? 'Image' : 'Video'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Drag and drop {fileType === 'image' ? 'an image' : 'a video'} here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200×514px • Max size: {maxFileSize}MB
                </p>
              </div>

              {/* Browse button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                disabled={disabled}
              >
                <FileImage className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          ) : (
            // File selected state - 16:9 preview area
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              {uploadState.uploading ? (
                // Uploading state
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadState.progress}%</span>
                    </div>
                    <Progress value={uploadState.progress} className="w-full" />
                  </div>
                </div>
              ) : uploadState.completed && uploadState.fileUrl ? (
                // Completed state - show preview
                <>
                  {fileType === 'image' ? (
                    <Image
                      src={uploadState.fileUrl}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : uploadState.videoViewingUrl ? (
                    <video
                      src={uploadState.videoViewingUrl}
                      className="w-full h-full object-cover"
                      controls={false}
                      preload="metadata"
                      muted
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Loading preview...</span>
                    </div>
                  )}

                  {/* Overlay controls - top right */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={handlePreviewOpen}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={handleClear}
                      disabled={uploadState.uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* File info - bottom left overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 p-3 rounded-lg bg-background/90 backdrop-blur-sm shadow-lg max-w-[calc(100%-6rem)]">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" title={uploadState.file.name}>
                        {uploadState.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </>
              ) : uploadState.error ? (
                // Error state
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-sm text-destructive font-medium">Upload failed</p>
                  <p className="text-xs text-muted-foreground">{uploadState.error}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="mt-2"
                  >
                    Try again
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>

        {/* Guidelines section */}
        <div className="px-4">
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100">
            <InfoIcon />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Cover {fileType === 'image' ? 'Image' : 'Video'} Guidelines
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <ul className="list-inside list-disc text-xs space-y-1">
                <li>Use high-quality {fileType}s with good lighting and composition</li>
                <li>Recommended aspect ratio: 21:9 (ultrawide) for best results</li>
                <li>Avoid {fileType}s with important content near the edges</li>
                <li>Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

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