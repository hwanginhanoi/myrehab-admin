import { useState } from 'react';
import Image from 'next/image';
import { Eye, Upload, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload/file-upload';

interface ImagePreviewProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  category: 'exercise' | 'course' | 'news' | 'banner' | 'profile';
  disabled?: boolean;
}

export function ImagePreview({ imageUrl, onImageChange, category, disabled = false }: ImagePreviewProps) {
  const [showUpload, setShowUpload] = useState(false);

  if (imageUrl && !showUpload) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
              <Image
                src={imageUrl}
                alt="Current exercise image"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
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
                Thay đổi hình ảnh
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onImageChange('')}
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
        onUploadCompleteAction={(fileUrl) => {
          onImageChange(fileUrl);
          setShowUpload(false);
        }}
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
        fileType="image"
        category={category}
        maxFileSize={10}
        disabled={disabled}
        className="w-full"
      />
      {imageUrl && showUpload && (
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