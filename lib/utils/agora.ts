/**
 * Agora video call utilities
 */

/**
 * Check if an appointment is currently active (within the scheduled time window)
 */
export function isAppointmentActive(
  appointmentDateTime: string,
  durationMinutes: number = 60
): boolean {
  const now = new Date();
  const startTime = new Date(appointmentDateTime);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

  return now >= startTime && now <= endTime;
}

/**
 * Check if an appointment hasn't started yet
 */
export function isAppointmentNotStarted(appointmentDateTime: string): boolean {
  const now = new Date();
  const startTime = new Date(appointmentDateTime);
  return now < startTime;
}

/**
 * Check if an appointment has already ended
 */
export function isAppointmentEnded(
  appointmentDateTime: string,
  durationMinutes: number = 60
): boolean {
  const now = new Date();
  const startTime = new Date(appointmentDateTime);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  return now > endTime;
}

/**
 * Get time remaining until appointment starts (in milliseconds)
 */
export function getTimeUntilStart(appointmentDateTime: string): number {
  const now = new Date();
  const startTime = new Date(appointmentDateTime);
  return Math.max(0, startTime.getTime() - now.getTime());
}

/**
 * Get time remaining until appointment ends (in milliseconds)
 */
export function getTimeUntilEnd(
  appointmentDateTime: string,
  durationMinutes: number = 60
): number {
  const now = new Date();
  const startTime = new Date(appointmentDateTime);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  return Math.max(0, endTime.getTime() - now.getTime());
}

/**
 * Format time remaining as a human-readable string
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string like "15 phút" or "1 giờ 30 phút"
 */
export function formatTimeRemaining(milliseconds: number, locale: 'vi' | 'en' = 'vi'): string {
  const totalMinutes = Math.ceil(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const labels = {
    vi: { hour: 'giờ', minute: 'phút', hours: 'giờ', minutes: 'phút' },
    en: { hour: 'hour', minute: 'minute', hours: 'hours', minutes: 'minutes' },
  };

  const l = labels[locale];

  if (hours > 0 && minutes > 0) {
    return `${hours} ${hours === 1 ? l.hour : l.hours} ${minutes} ${minutes === 1 ? l.minute : l.minutes}`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? l.hour : l.hours}`;
  } else {
    return `${minutes} ${minutes === 1 ? l.minute : l.minutes}`;
  }
}

/**
 * Check if appointment can have a video call
 */
export function canJoinVideoCall(
  appointmentType: string,
  appointmentStatus: string,
  appointmentDateTime: string,
  durationMinutes: number = 60
): { canJoin: boolean; reason?: string } {
  // Must be online appointment
  if (appointmentType !== 'ONLINE') {
    return {
      canJoin: false,
      reason: 'APPOINTMENT_TYPE_NOT_ONLINE',
    };
  }

  // Must be approved
  if (appointmentStatus !== 'APPROVED') {
    return {
      canJoin: false,
      reason: 'APPOINTMENT_NOT_APPROVED',
    };
  }

  // Check if not started
  if (isAppointmentNotStarted(appointmentDateTime)) {
    return {
      canJoin: false,
      reason: 'APPOINTMENT_NOT_STARTED',
    };
  }

  // Check if already ended
  if (isAppointmentEnded(appointmentDateTime, durationMinutes)) {
    return {
      canJoin: false,
      reason: 'APPOINTMENT_ENDED',
    };
  }

  return { canJoin: true };
}
