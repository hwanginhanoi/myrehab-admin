import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

interface BottomDropZoneProps {
  dayIndex: number;
}

export function BottomDropZone({ dayIndex }: BottomDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `course-day-bottom-${dayIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-4 p-4 border border-dashed border-[#BDBEC0] rounded-md transition-all duration-200 bg-[#F4F4F5] ${
        isOver
          ? 'border-[#6DBAD6] bg-[#6DBAD6]/5 shadow-sm'
          : 'hover:border-[#6DBAD6]/50 hover:bg-[#6DBAD6]/5'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-28 gap-2">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
          <Plus className="h-5 w-5 text-[#A1A1AA]" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-[#020617] mb-1">Thêm bài tập</p>
          <p className="text-base font-medium text-[#A1A1AA]">Kéo và thả bài tập vào đây</p>
        </div>
      </div>
    </div>
  );
}