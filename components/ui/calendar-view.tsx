'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isToday } from '@/lib/utils/datetime';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import React from 'react';

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  children?: (date: Date) => React.ReactNode;
  className?: string;
}

export function CalendarView({
  currentDate,
  onDateChange,
  onDateClick,
  children,
  className,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-[120px] p-2 border-r border-b last:border-r-0',
                  index >= days.length - 7 && 'border-b-0',
                  !isCurrentMonth && 'bg-muted/30',
                  'relative'
                )}
              >
                {/* Day number */}
                <button
                  onClick={() => onDateClick?.(day)}
                  className={cn(
                    'mb-1 h-6 w-6 rounded-full text-sm font-medium transition-colors hover:bg-accent',
                    !isCurrentMonth && 'text-muted-foreground',
                    isTodayDate && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {format(day, 'd')}
                </button>

                {/* Event content */}
                <div className="space-y-1 overflow-y-auto max-h-[90px]">
                  {children?.(day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
