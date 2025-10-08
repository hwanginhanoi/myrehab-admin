import { ExerciseResponse } from '@/api/types/ExerciseResponse';

export interface CourseBasicInfo {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationDays: number;
  categoryId: string;
}

export interface DayExercise {
  exerciseId: string;
  orderInDay: number;
  exercise?: ExerciseResponse;
}

export interface CourseDay {
  dayNumber: number;
  dayDescription: string;
  dayExercises: DayExercise[];
}

export interface CourseCreationFormData {
  basicInfo: CourseBasicInfo;
  courseDays: CourseDay[];
}

export type CourseCreationStep = 1 | 2;

export interface DragExerciseData {
  type: 'exercise';
  exercise: ExerciseResponse;
}

export interface DragDayExerciseData {
  type: 'day-exercise';
  dayIndex: number;
  exerciseIndex: number;
}

export type DragData = DragExerciseData | DragDayExerciseData;