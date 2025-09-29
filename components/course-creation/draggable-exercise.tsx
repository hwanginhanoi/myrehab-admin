import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye } from 'lucide-react';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';

interface DraggableExerciseProps {
  exercise: ExerciseResponse;
  onImageClick: (url: string, title: string) => void;
}

export function DraggableExercise({ exercise, onImageClick }: DraggableExerciseProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `exercise-${exercise.id}`,
    data: {
      type: 'exercise',
      exercise,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-[#BDBEC0] rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <GripVertical
            className={`h-5 w-5 ${isDragging ? 'text-blue-500' : 'text-[#BDBEC0]'}`}
          />
        </div>
        {exercise.imageUrl && (
          <div className="flex-shrink-0">
            <div
              className="relative w-40 h-[90px] rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(exercise.imageUrl!, exercise.title || 'Exercise image');
              }}
            >
              <Image
                src={exercise.imageUrl}
                alt={exercise.title || 'Exercise image'}
                fill
                className="object-cover"
                sizes="160px"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="h-3 w-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-normal text-base text-[#09090B] truncate mb-1">
            {exercise.title}
          </h3>
          <div className="flex items-center gap-2">
            {exercise.category?.name && (
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-[#BDBEC0] text-[#6D6E71] rounded">
                {exercise.category.name}
              </span>
            )}
            {exercise.durationMinutes && (
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
                <span className="text-sm text-[#6D6E71]">{exercise.durationMinutes}:30</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}