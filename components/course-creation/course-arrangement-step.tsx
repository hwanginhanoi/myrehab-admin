import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GripVertical } from 'lucide-react';
import { getAllExercises } from '@/api/api/exerciseManagementController';
import { ExerciseResponse } from '@/api/types/ExerciseResponse';
import { CourseCreationFormData } from '@/lib/types/course-creation';
import { useCourseDays } from '@/hooks/use-course-days';
import { useExerciseDragDrop } from '@/hooks/use-exercise-drag-drop';
import { CourseDayCard } from './course-day-card';
import { ExerciseSearchPanel } from './exercise-search-panel';

interface CourseArrangementStepProps {
  form: UseFormReturn<CourseCreationFormData>;
}

export function CourseArrangementStep({ form }: CourseArrangementStepProps) {
  const { watch } = form;
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const courseDays = useCourseDays(form);
  const dragDrop = useExerciseDragDrop(form, courseDays.moveDay);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const exercisesData = await getAllExercises();
        setExercises(exercisesData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch exercises';
        toast.error('Failed to load exercises', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchExercises();
  }, []);

  useEffect(() => {
    const durationDays = watch('basicInfo.durationDays');
    if (durationDays && courseDays.fields.length === 0) {
      courseDays.initializeDays(durationDays);
    }
  }, [watch, courseDays]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold mb-6">2. Chi tiết lộ trình</h3>

      {/* Course Days & Exercise Library */}
      <DndContext
        sensors={dragDrop.sensors}
        collisionDetection={closestCorners}
        onDragStart={dragDrop.handleDragStart}
        onDragEnd={(event) =>
          dragDrop.handleDragEnd(event, courseDays.fields.map((f) => f.id))
        }
      >
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Course Days Section */}
          <div className="flex flex-col lg:flex-1 lg:w-1/2 min-w-0">
            <div className="min-h-0">
              <SortableContext
                items={courseDays.fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6 pb-6">
                  {courseDays.fields.map((field, dayIndex) => (
                    <CourseDayCard
                      key={field.id}
                      field={field}
                      dayIndex={dayIndex}
                      canRemove={courseDays.fields.length > 1}
                      form={form}
                      onRemove={courseDays.removeDay}
                      onDuplicate={courseDays.duplicateDay}
                    />
                  ))}
                </div>
              </SortableContext>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={courseDays.addDay}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm ngày
                </Button>
              </div>
            </div>
          </div>

          {/* Exercise Library Section */}
          <div className="flex flex-col lg:flex-1 lg:w-1/2 min-w-0">
            <div className="sticky top-4">
              <div className="bg-[#F4F4F5] rounded-lg shadow-sm h-[80vh] flex flex-col">
                <SortableContext
                  items={exercises.map((ex) => `exercise-${ex.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <ExerciseSearchPanel
                    exercises={exercises}
                    onImageClick={(url, title) => setSelectedImage({ url, title })}
                  />
                </SortableContext>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {dragDrop.activeExercise ? (
            <Card className="shadow-2xl scale-105 opacity-90 border-primary">
              <CardContent className="p-3 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <GripVertical className="h-4 w-4 text-primary" />
                  </div>
                  {dragDrop.activeExercise.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-14 rounded-md overflow-hidden bg-primary/10">
                        <Image
                          src={dragDrop.activeExercise.imageUrl}
                          alt={dragDrop.activeExercise.title || 'Exercise image'}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate text-primary">
                      {dragDrop.activeExercise.title}
                    </h3>
                    {dragDrop.activeExercise.description && (
                      <p className="text-xs truncate mt-1 text-primary/80">
                        {dragDrop.activeExercise.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {dragDrop.activeExercise.category?.name && (
                        <Badge variant="default" className="text-xs">
                          {dragDrop.activeExercise.category.name}
                        </Badge>
                      )}
                      {dragDrop.activeExercise.durationMinutes && (
                        <span className="text-xs text-primary/70">
                          {dragDrop.activeExercise.durationMinutes}min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Image Viewer Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}