import Image from 'next/image';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExerciseImageProps {
  imageUrl?: string;
  title?: string;
  onClick?: () => void;
}

export function ExerciseImage({ imageUrl, title, onClick }: ExerciseImageProps) {
  const t = useTranslations('exercise');

  if (!imageUrl) {
    return (
      <div className="w-24 h-16 rounded-md bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">{t('noImage')}</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-24 h-16 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={title || 'Exercise image'}
        fill
        className="object-cover"
        sizes="96px"
      />
      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
        <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
