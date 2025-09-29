import { useState } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CourseCreationFormData, DayExercise } from '@/lib/types/course-creation';

export function useExerciseDragDrop(
  form: UseFormReturn<CourseCreationFormData>,
  onDayReorder?: (oldIndex: number, newIndex: number) => void
) {
  const { watch, setValue } = form;
  const [activeExercise, setActiveExercise] = useState<ExerciseResponse | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addExerciseToDay = (dayIndex: number, exercise: ExerciseResponse) => {
    const currentExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];

    // Check for duplicates
    const existingExercise = currentExercises.find(
      (ex) => ex.exerciseId === exercise.id?.toString()
    );
    if (existingExercise) {
      toast.warning('Bài tập đã tồn tại', {
        description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`,
      });
      return;
    }

    const newExercise: DayExercise = {
      exerciseId: exercise.id?.toString() || '',
      orderInDay: currentExercises.length + 1,
      exercise: exercise,
    };

    setValue(`courseDays.${dayIndex}.dayExercises`, [...currentExercises, newExercise]);

    toast.success('Đã thêm bài tập thành công', {
      description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`,
    });
  };

  const reorderExercisesInDay = (
    dayIndex: number,
    oldExerciseIndex: number,
    newExerciseIndex: number
  ) => {
    const currentExercises = watch(`courseDays.${dayIndex}.dayExercises`) || [];
    const reorderedExercises = [...currentExercises];

    // Move the exercise
    const [movedExercise] = reorderedExercises.splice(oldExerciseIndex, 1);
    reorderedExercises.splice(newExerciseIndex, 0, movedExercise);

    // Update order numbers
    const updatedExercises = reorderedExercises.map((ex, index) => ({
      ...ex,
      orderInDay: index + 1,
    }));

    setValue(`courseDays.${dayIndex}.dayExercises`, updatedExercises);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'exercise') {
      setActiveExercise(active.data.current.exercise as ExerciseResponse);
    }
  };

  const handleDragEnd = (event: DragEndEvent, courseDayFieldIds: string[]) => {
    const { active, over } = event;

    setActiveExercise(null);

    if (!over) return;

    const overId = over.id.toString();

    // Handle exercise reordering within a day
    if (
      active.data.current?.type === 'day-exercise' &&
      over.data.current?.type === 'day-exercise'
    ) {
      const activeDayIndex = active.data.current.dayIndex;
      const activeExerciseIndex = active.data.current.exerciseIndex;
      const overDayIndex = over.data.current.dayIndex;
      const overExerciseIndex = over.data.current.exerciseIndex;

      // Only handle reordering within the same day
      if (activeDayIndex === overDayIndex && activeExerciseIndex !== overExerciseIndex) {
        reorderExercisesInDay(activeDayIndex, activeExerciseIndex, overExerciseIndex);
      }
      return;
    }

    // Handle exercise drag to day
    if (active.data.current?.type === 'exercise') {
      const exercise = active.data.current.exercise as ExerciseResponse;

      // Check if dropped on a course day drop zone or bottom drop zone
      if (overId.startsWith('course-day-bottom-')) {
        const dayIndex = parseInt(overId.replace('course-day-bottom-', ''), 10);
        if (!isNaN(dayIndex)) {
          addExerciseToDay(dayIndex, exercise);
        }
      } else if (overId.startsWith('course-day-')) {
        const dayIndex = parseInt(overId.replace('course-day-', ''), 10);
        if (!isNaN(dayIndex)) {
          addExerciseToDay(dayIndex, exercise);
        }
      } else {
        // Fallback: Find which day this was dropped on by field ID
        const dayIndex = courseDayFieldIds.findIndex((fieldId) => fieldId === overId);
        if (dayIndex !== -1) {
          addExerciseToDay(dayIndex, exercise);
        }
      }
    } else if (onDayReorder && active.id !== over.id) {
      // Handle day reordering
      const oldIndex = courseDayFieldIds.findIndex((fieldId) => fieldId === active.id);
      const newIndex = courseDayFieldIds.findIndex((fieldId) => fieldId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onDayReorder(oldIndex, newIndex);
      }
    }
  };

  return {
    sensors,
    activeExercise,
    addExerciseToDay,
    reorderExercisesInDay,
    handleDragStart,
    handleDragEnd,
  };
}