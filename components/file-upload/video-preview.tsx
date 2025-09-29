import { useState, useEffect } from 'react';
import { Eye, Upload, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload/file-upload';
import { generateVideoViewingUrl } from '@/api/api/fileUploadController/generateVideoViewingUrl';
import { toast } from 'sonner';

interface VideoPreviewProps {
  videoUrl: string;
  onVideoChange: (url: string) => void;
  disabled?: boolean;
}

export function VideoPreview({ videoUrl, onVideoChange, disabled = false }: VideoPreviewProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [videoViewingUrl, setVideoViewingUrl] = useState<string | null>(null);
  const [loadingVideoUrl, setLoadingVideoUrl] = useState(false);

  const getVideoViewingUrl = async (url: string) => {
    try {
      setLoadingVideoUrl(true);
      const viewingUrl = await generateVideoViewingUrl({
        fileUrl: url,
        durationMinutes: 5,
      });
      setVideoViewingUrl(viewingUrl);
    } catch (error) {
      console.error('Failed to generate video viewing URL:', error);
      toast.error('Không thể tải video preview');
    } finally {
      setLoadingVideoUrl(false);
    }
  };

  useEffect(() => {
    if (videoUrl && !showUpload) {
      getVideoViewingUrl(videoUrl);
    }
  }, [videoUrl, showUpload]);

  if (videoUrl && !showUpload) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
              {loadingVideoUrl ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600">Đang tải video...</p>
                  </div>
                </div>
              ) : videoViewingUrl ? (
                <div className="relative w-full h-full">
                  <video
                    src={videoViewingUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    controls
                    muted
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-black/10 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Video đã tải lên</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => getVideoViewingUrl(videoUrl)}
                      className="mt-1"
                      disabled={disabled}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem video
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(true)}
                disabled={disabled}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Thay đổi video
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onVideoChange('');
                  setVideoViewingUrl(null);
                }}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <FileUpload
        onUploadComplete={(fileUrl) => {
          onVideoChange(fileUrl);
          setShowUpload(false);
        }}
        acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
        fileType="video"
        maxFileSize={100}
        disabled={disabled}
        className="w-full"
      />
      {videoUrl && showUpload && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowUpload(false)}
          className="mt-2"
          disabled={disabled}
        >
          Hủy thay đổi
        </Button>
      )}
    </div>
  );
}