import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UseFormReturn } from 'react-hook-form';
import { GripVertical, X, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseCreationFormData } from '@/lib/types/course-creation';
import { ExerciseDropZone } from './exercise-drop-zone';
import { BottomDropZone } from './bottom-drop-zone';
import { SortableDayExercise } from './sortable-day-exercise';

interface CourseDayCardProps {
  field: { id: string };
  dayIndex: number;
  canRemove: boolean;
  form: UseFormReturn<CourseCreationFormData>;
  onRemove: (dayIndex: number) => void;
  onDuplicate: (dayIndex: number) => void;
}

export function CourseDayCard({
  field,
  dayIndex,
  canRemove,
  form,
  onRemove,
  onDuplicate,
}: CourseDayCardProps) {
  const { register, watch } = form;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dayExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-l-2 border-l-[#6DBAD6] border-t border-t-gray-200 rounded-lg shadow-sm p-6 space-y-3 relative z-10"
    >
      {/* Header with drag handle and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-[#6DBAD6]" />
          </div>
          <h3 className="text-xl font-bold text-[#6DBAD6]">
            Ngày {watch(`courseDays.${dayIndex}.dayNumber`)}
          </h3>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(dayIndex)}
            className="h-8 w-8 p-0 border-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
            title="Sao chép ngày"
          >
            <Copy className="h-4 w-4 text-[#6DBAD6]" />
          </Button>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(dayIndex)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              title="Xóa ngày"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Day description input */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`courseDays.${dayIndex}.dayDescription`}
          className="text-base font-medium text-[#09090B]"
        >
          Mô tả
        </Label>
        <Input
          {...register(`courseDays.${dayIndex}.dayDescription`)}
          placeholder="Mô tả"
          className="border-[#BDBEC0] focus:border-[#6DBAD6] focus:ring-[#6DBAD6] rounded-md h-10"
        />
      </div>

      {/* Exercises Drop Zone */}
      <div className="space-y-1.5">
        <Label className="text-base font-medium text-[#09090B]">Bài tập</Label>
        <ExerciseDropZone dayIndex={dayIndex} form={form}>
          {dayExercises.length > 0 ? (
            <SortableContext
              items={dayExercises.map((_, index: number) => `day-${dayIndex}-exercise-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 w-full flex-1">
                {dayExercises.map((exercise, exerciseIndex: number) => {
                  const exerciseData = exercise.exercise || {};
                  return (
                    <SortableDayExercise
                      key={`day-${dayIndex}-exercise-${exerciseIndex}`}
                      id={`day-${dayIndex}-exercise-${exerciseIndex}`}
                      exercise={exercise}
                      exerciseData={exerciseData}
                      exerciseIndex={exerciseIndex}
                      dayIndex={dayIndex}
                      dayExercises={dayExercises}
                      form={form}
                    />
                  );
                })}
              </div>
            </SortableContext>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <div className="w-9 h-9 mx-auto rounded-full bg-white flex items-center justify-center mb-2">
                  <Plus className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <p className="text-base font-medium text-[#020617] mb-1">Thêm bài tập</p>
                <p className="text-base font-medium text-[#A1A1AA]">
                  Kéo và thả bài tập vào đây
                </p>
              </div>
            </div>
          )}
          {/* Always show a dedicated drop area at the bottom for when there are exercises */}
          {dayExercises.length > 0 && <BottomDropZone dayIndex={dayIndex} />}
        </ExerciseDropZone>
      </div>
    </div>
  );
}