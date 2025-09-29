import { useDroppable } from '@dnd-kit/core';
import { UseFormReturn } from 'react-hook-form';
import { CourseCreationFormData } from '@/lib/types/course-creation';

interface ExerciseDropZoneProps {
  dayIndex: number;
  form: UseFormReturn<CourseCreationFormData>;
  children: React.ReactNode;
}

export function ExerciseDropZone({ dayIndex, form, children }: ExerciseDropZoneProps) {
  const { watch } = form;
  const { isOver, setNodeRef } = useDroppable({
    id: `course-day-${dayIndex}`,
  });

  const dayExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] w-full border border-dashed border-[#BDBEC0] rounded-md p-4 transition-all duration-200 relative bg-[#F4F4F5] ${
        isOver
          ? 'border-[#6DBAD6] bg-[#6DBAD6]/5 shadow-sm'
          : 'hover:border-[#6DBAD6]/50 hover:bg-[#6DBAD6]/5'
      }`}
      style={{
        height: 'auto',
        minHeight:
          dayExercises.length > 0
            ? `${Math.max(120, dayExercises.length * 70 + 80)}px`
            : '120px',
      }}
    >
      {children}
    </div>
  );
}