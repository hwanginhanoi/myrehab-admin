'use client';

import NextImage from 'next/image';
import { useState, forwardRef, useEffect } from 'react';
import { Eye, ImageIcon, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageProps extends Omit<React.ComponentProps<typeof NextImage>, 'onClick' | 'placeholder'> {
  onClick?: (url: string, title?: string) => void;
  showPreviewIcon?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  loading?: 'eager' | 'lazy';
  placeholder?: 'blur' | 'empty' | React.ReactNode;
  fallback?: React.ReactNode;
  sizes?: string;
  type?: 'image' | 'video';
  videoUrl?: string;
}

const Image = forwardRef<HTMLDivElement, ImageProps>(({
  src,
  alt = 'Image',
  onClick,
  showPreviewIcon = false,
  aspectRatio = 'auto',
  rounded = 'md',
  className,
  loading = 'lazy',
  placeholder,
  fallback,
  sizes,
  fill = false,
  width,
  height,
  type = 'image',
  videoUrl,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  // Generate video thumbnail
  useEffect(() => {
    if (type === 'video' && videoUrl) {
      console.log('Starting video thumbnail generation for:', videoUrl);
      setIsLoading(true);
      setHasError(false);
      setVideoThumbnail(null);

      const video = document.createElement('video');

      // Remove crossOrigin which might cause CORS issues
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.controls = false;

      let thumbnailGenerated = false;

      const generateThumbnail = () => {
        if (thumbnailGenerated) return;

        try {
          console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);

          if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('Invalid video dimensions');
            setHasError(true);
            setIsLoading(false);
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

            console.log('Thumbnail generated successfully');
            setVideoThumbnail(dataUrl);
            setIsLoading(false);
            thumbnailGenerated = true;
          } else {
            throw new Error('Could not get canvas context');
          }
        } catch (error) {
          console.error('Error generating video thumbnail:', error);
          setHasError(true);
          setIsLoading(false);
        }
      };

      video.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        // Try to seek to get a better frame
        video.currentTime = 0.5;
      };

      video.onloadeddata = () => {
        console.log('Video data loaded');
        generateThumbnail();
      };

      video.onseeked = () => {
        console.log('Video seeked to:', video.currentTime);
        generateThumbnail();
      };

      video.oncanplay = () => {
        console.log('Video can play');
        if (!thumbnailGenerated) {
          generateThumbnail();
        }
      };

      video.onerror = (error) => {
        console.error('Video loading error:', error, video.error);
        setHasError(true);
        setIsLoading(false);
      };

      video.onabort = () => {
        console.log('Video loading aborted');
      };

      video.onstalled = () => {
        console.log('Video loading stalled');
      };

      console.log('Setting video source:', videoUrl);
      video.src = videoUrl;
      video.load();

      // Timeout fallback
      const timeout = setTimeout(() => {
        if (!thumbnailGenerated && !video.error) {
          console.log('Timeout reached, trying to generate thumbnail anyway');
          generateThumbnail();
        }
      }, 5000);

      // Cleanup function
      return () => {
        clearTimeout(timeout);
        video.pause();
        video.src = '';
        video.load();
      };
    } else if (type === 'image') {
      setIsLoading(true);
      setVideoThumbnail(null);
    }
  }, [type, videoUrl]);

  const handleClick = () => {
    if (onClick) {
      if (type === 'video' && videoUrl) {
        onClick(videoUrl, alt);
      } else if (src) {
        onClick(src.toString(), alt);
      }
    }
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const baseClasses = cn(
    'relative overflow-hidden bg-muted',
    aspectRatioClasses[aspectRatio],
    roundedClasses[rounded],
    onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  if (hasError && fallback) {
    return <div ref={ref} className={baseClasses}>{fallback}</div>;
  }

  if (hasError) {
    return (
      <div ref={ref} className={cn(baseClasses, 'flex items-center justify-center')}>
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  // Determine what to display
  const displaySrc = type === 'video' ? videoThumbnail : src;
  const showContent = displaySrc || (type === 'image' && src);
  const isVideoLoading = type === 'video' && isLoading && !videoThumbnail;

  return (
    <div ref={ref} className={baseClasses} onClick={handleClick}>
      {showContent ? (
        <>
          <NextImage
            src={displaySrc!}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className={cn(
              'object-cover transition-opacity',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
            loading={loading}
            placeholder={(typeof placeholder === 'string' && (placeholder === 'blur' || placeholder === 'empty')) ? placeholder : 'empty'}
            sizes={sizes || (fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
            onLoad={() => {
              if (type === 'image') {
                setIsLoading(false);
              }
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            {...props}
          />

          {/* Loading state */}
          {(isLoading || isVideoLoading) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {typeof placeholder === 'string' ? (
                <div className="animate-pulse bg-muted-foreground/20 w-full h-full" />
              ) : placeholder || (
                <div className="animate-pulse bg-muted-foreground/20 w-full h-full flex items-center justify-center">
                  <div className="text-xs text-muted-foreground">
                    {type === 'video' ? 'Generating thumbnail...' : 'Loading...'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Show play icon for videos, eye icon for images */}
          {showPreviewIcon && onClick && !isLoading && !isVideoLoading && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              {type === 'video' ? (
                <Play className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" fill="currentColor" />
              ) : (
                <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}

          {/* Always show play icon for videos even without showPreviewIcon */}
          {type === 'video' && !showPreviewIcon && !isLoading && !isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 rounded-full p-2">
                <Play className="h-4 w-4 text-white" fill="currentColor" />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          {isVideoLoading ? (
            <div className="text-center">
              <div className="animate-pulse bg-muted-foreground/20 w-12 h-12 rounded mb-2 mx-auto"></div>
              <div className="text-xs text-muted-foreground">Generating thumbnail...</div>
            </div>
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          )}
        </div>
      )}
    </div>
  );
});

Image.displayName = 'Image';

export { Image };
export type { ImageProps };