'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface MediaViewerDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  fileType: 'image' | 'video';
  fileName: string;
  imageUrl?: string;
  videoUrl?: string;
}

export function MediaViewerDialog({
  open,
  onOpenChangeAction,
  fileType,
  fileName,
  imageUrl,
  videoUrl,
}: MediaViewerDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Custom Overlay */}
      <div
        onClick={() => onOpenChangeAction(false)}
      />

      {/* Custom Dialog */}
      <div
        className="fixed z-50 bg-background border border-border rounded-lg shadow-xl"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 1200px)',
          height: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {/* Header with close button */}
          <div className="p-4 pb-2 flex items-center justify-between border-b border-border">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {fileType === 'image' ? 'Image View' : 'Video Player'} - {fileName}
            </h2>
            <button
              onClick={() => onOpenChangeAction(false)}
              className="p-1 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            {fileType === 'image' && imageUrl ? (
              <div
                className="relative rounded-lg overflow-hidden bg-black"
                style={{
                  width: 'calc(min(90vw, 1200px) - 2rem)',
                  height: 'calc((min(90vw, 1200px) - 2rem) * 9 / 16)'
                }}
              >
                <Image
                  src={imageUrl}
                  alt="Full size preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            ) : fileType === 'video' && videoUrl ? (
              <div
                className="relative rounded-lg overflow-hidden bg-black"
                style={{
                  width: 'calc(min(90vw, 1200px) - 2rem)',
                  height: 'calc((min(90vw, 1200px) - 2rem) * 9 / 16)'
                }}
              >
                <video
                  src={videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay={true}
                  preload="metadata"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center bg-muted border border-border rounded-lg"
                style={{
                  width: 'calc(min(90vw, 1200px) - 2rem)',
                  height: 'calc((min(90vw, 1200px) - 2rem) * 9 / 16)'
                }}
              >
                <span className="text-muted-foreground text-sm">
                  {fileType === 'video' ? 'Loading video...' : 'Loading image...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}