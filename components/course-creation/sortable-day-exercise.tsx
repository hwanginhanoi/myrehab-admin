import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UseFormReturn } from 'react-hook-form';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CourseCreationFormData, DayExercise } from '@/lib/types/course-creation';

interface SortableDayExerciseProps {
  id: string;
  exercise: DayExercise;
  exerciseData: ExerciseResponse | Record<string, never>;
  exerciseIndex: number;
  dayIndex: number;
  dayExercises: DayExercise[];
  form: UseFormReturn<CourseCreationFormData>;
}

export function SortableDayExercise({
  id,
  exercise,
  exerciseData,
  exerciseIndex,
  dayIndex,
  dayExercises,
  form,
}: SortableDayExerciseProps) {
  const { setValue } = form;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'day-exercise',
      dayIndex,
      exerciseIndex,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exerciseTyped = exerciseData as ExerciseResponse;

  const handleRemove = () => {
    const updatedExercises = dayExercises
      .filter((_, idx: number) => idx !== exerciseIndex)
      .map((ex, newIdx: number) => ({
        ...ex,
        orderInDay: newIdx + 1,
      }));
    setValue(`courseDays.${dayIndex}.dayExercises`, updatedExercises);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-[#BDBEC0] rounded-lg p-4 hover:shadow-sm transition-shadow w-full"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-[#BDBEC0]" />
          </div>
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F4F4F5] flex items-center justify-center">
            <span className="text-sm font-normal text-[#09090B]">
              {exercise.orderInDay || exerciseIndex + 1}
            </span>
          </div>
        </div>
        {exerciseTyped.imageUrl && (
          <div className="flex-shrink-0">
            <div className="relative w-40 h-[90px] rounded-md overflow-hidden bg-gray-100">
              <Image
                src={exerciseTyped.imageUrl}
                alt={exerciseTyped.title || 'Exercise image'}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="font-normal text-base text-[#09090B] truncate mb-1">
            {exerciseTyped.title || 'Unknown Exercise'}
          </h5>
          <div className="flex items-center gap-2">
            {exerciseTyped.category?.name && (
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-[#BDBEC0] text-[#6D6E71] rounded">
                {exerciseTyped.category.name}
              </span>
            )}
            {exerciseTyped.durationMinutes && (
              <div className="flex items-center gap-0.5">
                <div className="w-3 h-3">
                  <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                    <path
                      d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
                      stroke="#6D6E71"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 5V10L13.3333 11.6667"
                      stroke="#6D6E71"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm text-[#6D6E71]">{exerciseTyped.durationMinutes}:30</span>
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
          onClick={handleRemove}
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      </div>
    </div>
  );
}