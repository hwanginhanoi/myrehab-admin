import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';

interface ExerciseActionsProps {
  exerciseId?: number;
}

export function ExerciseActions({ exerciseId }: ExerciseActionsProps) {
  const router = useRouter();
  const t = useTranslations('exercise');

  if (!exerciseId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/exercises/${exerciseId}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t('viewDetails')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/exercises/${exerciseId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t('editExerciseAction')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
