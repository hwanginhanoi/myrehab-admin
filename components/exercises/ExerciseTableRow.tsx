import { useTranslations } from 'next-intl';
import { TableCell, TableRow } from '@/components/ui/table';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { ExerciseImage } from './ExerciseImage';
import { ExerciseActions } from './ExerciseActions';

interface ExerciseTableRowProps {
  exercise: ExerciseResponse;
  index: number;
  onImageClick: (url: string, title: string) => void;
}

export function ExerciseTableRow({ exercise, index, onImageClick }: ExerciseTableRowProps) {
  const t = useTranslations('exercise');

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <TableCell>
        <ExerciseImage
          imageUrl={exercise.imageUrl}
          title={exercise.title}
          onClick={() => exercise.imageUrl && onImageClick(exercise.imageUrl, exercise.title || 'Exercise image')}
        />
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{exercise.title}</div>
          {exercise.description && (
            <div className="text-sm text-muted-foreground truncate max-w-xs">
              {exercise.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {exercise.category?.name || '-'}
      </TableCell>
      <TableCell>
        {exercise.durationMinutes ? `${exercise.durationMinutes} ${t('durationMinutes')}` : '-'}
      </TableCell>
      <TableCell>
        <ExerciseActions exerciseId={exercise.id} />
      </TableCell>
    </TableRow>
  );
}
