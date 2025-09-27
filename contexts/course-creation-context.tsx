'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAllCategories } from '@/api/api/categoryManagementController';
import { getAllExercises } from '@/api/api/exerciseManagementController';
import { createCourse } from '@/api/api/courseManagementController';
import { CategoryResponse } from '@/api/types/CategoryResponse';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CreateCourseRequest } from '@/api/types/CreateCourseRequest';
import { CreateCourseDayRequest } from '@/api/types/CreateCourseDayRequest';
import { CreateDayExerciseRequest } from '@/api/types/CreateDayExerciseRequest';

interface CourseBasicInfo {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationDays: number;
  categoryId?: number;
}

interface CourseDay {
  dayNumber: number;
  dayDescription: string;
  dayExercises: {
    exerciseId: string;
    orderInDay: number;
    exercise?: ExerciseResponse;
  }[];
}

interface CourseCreationState {
  // Basic course information
  basicInfo: CourseBasicInfo | null;
  
  // Course days and exercises
  courseDays: CourseDay[];
  
  // Available data
  categories: CategoryResponse[];
  exercises: ExerciseResponse[];
  
  // Loading states
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Current step
  currentStep: 'basic' | 'arrange';
}

interface CourseCreationContextType extends CourseCreationState {
  // Basic info actions
  setBasicInfo: (info: CourseBasicInfo) => void;
  updateBasicInfo: (updates: Partial<CourseBasicInfo>) => void;
  
  // Course days actions
  setCourseDays: (days: CourseDay[]) => void;
  addCourseDay: () => void;
  removeCourseDay: (dayIndex: number) => void;
  duplicateCourseDay: (dayIndex: number) => void;
  updateCourseDay: (dayIndex: number, updates: Partial<CourseDay>) => void;
  
  // Exercise actions
  addExerciseToDay: (dayIndex: number, exercise: ExerciseResponse) => void;
  removeExerciseFromDay: (dayIndex: number, exerciseIndex: number) => void;
  reorderExercisesInDay: (dayIndex: number, fromIndex: number, toIndex: number) => void;
  
  // Navigation actions
  goToNextStep: (basicInfo?: CourseBasicInfo) => void;
  goToPreviousStep: () => void;
  goToStep: (step: 'basic' | 'arrange') => void;
  
  // Data loading
  loadCategories: () => Promise<void>;
  loadExercises: () => Promise<void>;
  
  // Save actions
  saveCourse: () => Promise<void>;
  resetCourse: () => void;
  
  // Utility
  isStepValid: (step: 'basic' | 'arrange') => boolean;
}

const CourseCreationContext = createContext<CourseCreationContextType | undefined>(undefined);

interface CourseCreationProviderProps {
  children: ReactNode;
}

export function CourseCreationProvider({ children }: CourseCreationProviderProps) {
  const router = useRouter();
  
  const [state, setState] = useState<CourseCreationState>({
    basicInfo: null,
    courseDays: [],
    categories: [],
    exercises: [],
    loading: false,
    saving: false,
    error: null,
    currentStep: 'basic',
  });

  // Basic info actions
  const setBasicInfo = useCallback((info: CourseBasicInfo) => {
    setState(prev => ({ ...prev, basicInfo: info }));
  }, []);

  const updateBasicInfo = useCallback((updates: Partial<CourseBasicInfo>) => {
    setState(prev => ({
      ...prev,
      basicInfo: prev.basicInfo ? { ...prev.basicInfo, ...updates } : null
    }));
  }, []);

  // Course days actions
  const setCourseDays = useCallback((days: CourseDay[]) => {
    setState(prev => ({ ...prev, courseDays: days }));
  }, []);

  const addCourseDay = useCallback(() => {
    setState(prev => ({
      ...prev,
      courseDays: [
        ...prev.courseDays,
        {
          dayNumber: prev.courseDays.length + 1,
          dayDescription: '',
          dayExercises: []
        }
      ]
    }));
  }, []);

  const removeCourseDay = useCallback((dayIndex: number) => {
    setState(prev => {
      const newDays = prev.courseDays.filter((_, index) => index !== dayIndex);
      // Renumber days
      const renumberedDays = newDays.map((day, index) => ({
        ...day,
        dayNumber: index + 1
      }));
      return { ...prev, courseDays: renumberedDays };
    });
  }, []);

  const duplicateCourseDay = useCallback((dayIndex: number) => {
    setState(prev => {
      const dayToDuplicate = prev.courseDays[dayIndex];
      const newDay: CourseDay = {
        dayNumber: prev.courseDays.length + 1,
        dayDescription: dayToDuplicate.dayDescription ? `${dayToDuplicate.dayDescription} (Copy)` : '',
        dayExercises: dayToDuplicate.dayExercises.map(exercise => ({
          ...exercise,
          exercise: exercise.exercise
        }))
      };
      return {
        ...prev,
        courseDays: [...prev.courseDays, newDay]
      };
    });
  }, []);

  const updateCourseDay = useCallback((dayIndex: number, updates: Partial<CourseDay>) => {
    setState(prev => ({
      ...prev,
      courseDays: prev.courseDays.map((day, index) =>
        index === dayIndex ? { ...day, ...updates } : day
      )
    }));
  }, []);

  // Exercise actions
  const addExerciseToDay = useCallback((dayIndex: number, exercise: ExerciseResponse) => {
    setState(prev => {
      const day = prev.courseDays[dayIndex];
      if (!day) return prev;

      // Check if exercise already exists
      const existingExercise = day.dayExercises.find(ex => ex.exerciseId === exercise.id?.toString());
      if (existingExercise) {
        toast.warning('Bài tập đã tồn tại', {
          description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`
        });
        return prev;
      }

      const newExercise = {
        exerciseId: exercise.id?.toString() || '',
        orderInDay: day.dayExercises.length + 1,
        exercise: exercise
      };

      const updatedDays = prev.courseDays.map((d, index) =>
        index === dayIndex
          ? { ...d, dayExercises: [...d.dayExercises, newExercise] }
          : d
      );

      toast.success('Đã thêm bài tập thành công', {
        description: `"${exercise.title}" đã được thêm vào Ngày ${dayIndex + 1}.`
      });

      return { ...prev, courseDays: updatedDays };
    });
  }, []);

  const removeExerciseFromDay = useCallback((dayIndex: number, exerciseIndex: number) => {
    setState(prev => {
      const updatedDays = prev.courseDays.map((day, index) => {
        if (index === dayIndex) {
          const newExercises = day.dayExercises
            .filter((_, exIndex) => exIndex !== exerciseIndex)
            .map((ex, newIndex) => ({ ...ex, orderInDay: newIndex + 1 }));
          return { ...day, dayExercises: newExercises };
        }
        return day;
      });
      return { ...prev, courseDays: updatedDays };
    });
  }, []);

  const reorderExercisesInDay = useCallback((dayIndex: number, fromIndex: number, toIndex: number) => {
    setState(prev => {
      const updatedDays = prev.courseDays.map((day, index) => {
        if (index === dayIndex) {
          const newExercises = [...day.dayExercises];
          const [movedExercise] = newExercises.splice(fromIndex, 1);
          newExercises.splice(toIndex, 0, movedExercise);
          
          // Update order numbers
          const reorderedExercises = newExercises.map((ex, exIndex) => ({
            ...ex,
            orderInDay: exIndex + 1
          }));
          
          return { ...day, dayExercises: reorderedExercises };
        }
        return day;
      });
      return { ...prev, courseDays: updatedDays };
    });
  }, []);

  // Navigation actions
  const goToNextStep = useCallback((basicInfo?: CourseBasicInfo) => {
    if (state.currentStep === 'basic') {
      const infoToUse = basicInfo || state.basicInfo;
      
      if (!infoToUse) {
        toast.error('Vui lòng nhập thông tin cơ bản trước');
        return;
      }
      
      // Set basic info if provided
      if (basicInfo) {
        setState(prev => ({ ...prev, basicInfo }));
      }
      
      // Initialize course days based on duration
      const initialDays = Array.from({ length: Math.min(infoToUse.durationDays, 30) }, (_, index) => ({
        dayNumber: index + 1,
        dayDescription: '',
        dayExercises: []
      }));
      
      setState(prev => ({
        ...prev,
        currentStep: 'arrange',
        courseDays: initialDays
      }));
      
      router.push('/dashboard/courses/create/arrange');
    }
  }, [state.currentStep, state.basicInfo, router]);

  const goToPreviousStep = useCallback(() => {
    if (state.currentStep === 'arrange') {
      setState(prev => ({ ...prev, currentStep: 'basic' }));
      router.push('/dashboard/courses/create');
    } else {
      router.push('/dashboard/courses');
    }
  }, [state.currentStep, router]);

  const goToStep = useCallback((step: 'basic' | 'arrange') => {
    setState(prev => ({ ...prev, currentStep: step }));
    if (step === 'basic') {
      router.push('/dashboard/courses/create');
    } else {
      router.push('/dashboard/courses/create/arrange');
    }
  }, [router]);

  // Data loading
  const loadCategories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const categoriesData = await getAllCategories();
      setState(prev => ({ ...prev, categories: categoriesData, loading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error('Failed to load categories', {
        description: errorMessage,
      });
    }
  }, []);

  const loadExercises = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const exercisesData = await getAllExercises();
      setState(prev => ({ ...prev, exercises: exercisesData, loading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error('Failed to load exercises', {
        description: errorMessage,
      });
    }
  }, []);

  // Save actions
  const saveCourse = useCallback(async () => {
    if (!state.basicInfo) {
      toast.error('Không tìm thấy thông tin khóa học cơ bản');
      return;
    }

    try {
      setState(prev => ({ ...prev, saving: true }));

      const requestData: CreateCourseRequest = {
        title: state.basicInfo.title,
        description: state.basicInfo.description || undefined,
        imageUrl: state.basicInfo.imageUrl || undefined,
        price: state.basicInfo.price,
        durationDays: state.basicInfo.durationDays,
        categoryId: state.basicInfo.categoryId,
        courseDays: state.courseDays.map((day): CreateCourseDayRequest => ({
          dayNumber: day.dayNumber,
          dayDescription: day.dayDescription || undefined,
          dayExercises: day.dayExercises.map((exercise): CreateDayExerciseRequest => ({
            exerciseId: parseInt(exercise.exerciseId, 10),
            orderInDay: exercise.orderInDay,
            customRepetitions: undefined,
            customSets: undefined,
            customDurationMinutes: undefined,
            notes: undefined,
          })),
        })),
      };

      const createdCourse = await createCourse(requestData);

      toast.success('Khóa học đã được tạo thành công!', {
        description: `"${state.basicInfo.title}" đã được tạo và sẵn sàng sử dụng.`
      });

      // Reset state
      setState({
        basicInfo: null,
        courseDays: [],
        categories: [],
        exercises: [],
        loading: false,
        saving: false,
        error: null,
        currentStep: 'basic',
      });

      if (createdCourse.id) {
        router.push(`/dashboard/courses/${createdCourse.id}`);
      } else {
        router.push('/dashboard/courses');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn khi tạo khóa học.';
      setState(prev => ({ ...prev, saving: false }));
      toast.error('Lỗi khi tạo khóa học', {
        description: errorMessage,
      });
    }
  }, [state.basicInfo, state.courseDays, router]);

  const resetCourse = useCallback(() => {
    setState({
      basicInfo: null,
      courseDays: [],
      categories: [],
      exercises: [],
      loading: false,
      saving: false,
      error: null,
      currentStep: 'basic',
    });
  }, []);

  // Utility
  const isStepValid = useCallback((step: 'basic' | 'arrange') => {
    if (step === 'basic') {
      return !!(
        state.basicInfo?.title &&
        state.basicInfo?.price !== undefined &&
        state.basicInfo?.durationDays !== undefined
      );
    }
    return state.courseDays.length > 0;
  }, [state.basicInfo, state.courseDays]);

  const contextValue: CourseCreationContextType = {
    ...state,
    setBasicInfo,
    updateBasicInfo,
    setCourseDays,
    addCourseDay,
    removeCourseDay,
    duplicateCourseDay,
    updateCourseDay,
    addExerciseToDay,
    removeExerciseFromDay,
    reorderExercisesInDay,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    loadCategories,
    loadExercises,
    saveCourse,
    resetCourse,
    isStepValid,
  };

  return (
    <CourseCreationContext.Provider value={contextValue}>
      {children}
    </CourseCreationContext.Provider>
  );
}

export function useCourseCreation() {
  const context = useContext(CourseCreationContext);
  if (context === undefined) {
    throw new Error('useCourseCreation must be used within a CourseCreationProvider');
  }
  return context;
}
