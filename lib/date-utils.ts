import { isWithinInterval, startOfDay, isValid, isSameDay } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Check if a date is within any of the provided ranges
 */
export const isDateInRanges = (
  date: Date,
  dateRanges: DateRange[],
): boolean => {
  if (!date || !isValid(date)) return false;
  return dateRanges.some((range) => {
    try {
      if (!isValid(range.start) || !isValid(range.end)) return false;
      return isWithinInterval(startOfDay(date), {
        start: startOfDay(range.start),
        end: startOfDay(range.end),
      });
    } catch {
      return false;
    }
  });
};

/**
 * Get the adjacent date (previous or next day)
 */
export const getAdjacentDate = (
  date: Date,
  direction: 'left' | 'right',
): Date => {
  const adjacentDate = new Date(date);
  adjacentDate.setDate(
    adjacentDate.getDate() + (direction === 'right' ? 1 : -1),
  );
  return adjacentDate;
};

/**
 * Check if drag date should be updated (different day)
 */
export const shouldUpdateDragDate = (
  currentDate: Date | null,
  newDate: Date,
): boolean => {
  if (!currentDate || !isValid(currentDate)) return true;
  if (!newDate || !isValid(newDate)) return false;
  return !isSameDay(newDate, currentDate);
};

/**
 * Find which date element is under a pointer position
 */
export const findDateElementFromPoint = (
  clientX: number,
  clientY: number,
  dateButtonsMap: Map<string, HTMLElement>,
): Date | null => {
  if (typeof document === 'undefined') return null;

  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return null;

  for (const [dateStr, button] of Array.from(dateButtonsMap.entries())) {
    if (button === element || button.contains(element)) {
      const date = new Date(dateStr);
      if (isValid(date)) {
        return date;
      }
    }
  }

  return null;
};
