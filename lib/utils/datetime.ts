import { format, parseISO, addMinutes, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export type Locale = 'vi' | 'en';

/**
 * Format appointment date in localized format (e.g., "15 tháng 1, 2024" or "January 15, 2024")
 */
export function formatAppointmentDate(date: string | Date, locale: Locale = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP', { locale: locale === 'vi' ? vi : enUS });
}

/**
 * Format appointment time in 24-hour format (e.g., "14:30")
 */
export function formatAppointmentTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
}

/**
 * Format full appointment date and time (e.g., "15 tháng 1, 2024 lúc 14:30")
 */
export function formatAppointmentDateTime(date: string | Date, locale: Locale = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const dateFormat = locale === 'vi' ? "PPP 'lúc' HH:mm" : "PPP 'at' HH:mm";
  return format(dateObj, dateFormat, { locale: locale === 'vi' ? vi : enUS });
}

/**
 * Format date for display in shorter format (e.g., "15/01/2024")
 */
export function formatShortDate(date: string | Date, locale: Locale = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'P', { locale: locale === 'vi' ? vi : enUS });
}

/**
 * Combine date and time strings into ISO datetime string
 */
export function combineDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.toISOString();
}

/**
 * Calculate end time from start time and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = parseISO(startTime);
  const end = addMinutes(start, durationMinutes);
  return end.toISOString();
}

/**
 * Get date range for a specific month
 */
export function getMonthDateRange(year: number, month: number) {
  const date = new Date(year, month, 1);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Get start and end of a specific day
 */
export function getDayRange(date: Date) {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number, locale: Locale = 'vi'): string {
  if (minutes < 60) {
    return locale === 'vi' ? `${minutes} phút` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return locale === 'vi' ? `${hours} giờ` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return locale === 'vi'
    ? `${hours} giờ ${mins} phút`
    : `${hours} hour${hours > 1 ? 's' : ''} ${mins} min`;
}
