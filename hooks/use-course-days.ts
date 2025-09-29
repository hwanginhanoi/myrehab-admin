import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { CourseCreationFormData, CourseDay } from '@/lib/types/course-creation';

export function useCourseDays(form: UseFormReturn<CourseCreationFormData>) {
  const { control, watch, setValue } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'courseDays',
  });

  const addDay = () => {
    append({
      dayNumber: fields.length + 1,
      dayDescription: '',
      dayExercises: [],
    });
  };

  const removeDay = (dayIndex: number) => {
    remove(dayIndex);

    toast.success('Đã xóa ngày thành công', {
      description: `Ngày ${dayIndex + 1} đã được xóa khỏi khóa học.`,
    });

    // Renumber remaining days
    setTimeout(() => {
      fields.forEach((_, index) => {
        if (index < fields.length - 1) {
          setValue(`courseDays.${index}.dayNumber`, index + 1);
        }
      });
    }, 0);
  };

  const duplicateDay = (dayIndex: number) => {
    const dayToDuplicate = watch(`courseDays.${dayIndex}`);
    const newDay: CourseDay = {
      dayNumber: fields.length + 1,
      dayDescription: dayToDuplicate.dayDescription
        ? `${dayToDuplicate.dayDescription} (Copy)`
        : '',
      dayExercises: dayToDuplicate.dayExercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        orderInDay: exercise.orderInDay,
        exercise: exercise.exercise,
      })),
    };
    append(newDay);

    toast.success('Đã sao chép ngày thành công', {
      description: `Ngày ${dayIndex + 1} đã được sao chép thành Ngày ${fields.length + 1}.`,
    });
  };

  const moveDay = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);

    // Renumber days after reordering
    setTimeout(() => {
      fields.forEach((_, index) => {
        setValue(`courseDays.${index}.dayNumber`, index + 1);
      });
    }, 0);
  };

  const initializeDays = (durationDays: number) => {
    const initialDays: CourseDay[] = Array.from(
      { length: Math.min(durationDays, 30) },
      (_, index) => ({
        dayNumber: index + 1,
        dayDescription: '',
        dayExercises: [],
      })
    );
    setValue('courseDays', initialDays);
  };

  return {
    fields,
    addDay,
    removeDay,
    duplicateDay,
    moveDay,
    initializeDays,
  };
}