import { isWithinInterval, startOfDay, isValid, isSameDay } from "date-fns";

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Checks if a date falls within any of the provided date ranges.
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
 * Determines if the drag date should be updated to the new date.
 * Returns true if the dates are different or if there's no current date.
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
 * Finds a date element at the given point coordinates.
 * Returns the Date if found, null otherwise.
 */
export const findDateElementFromPoint = (
  clientX: number,
  clientY: number,
  dateButtonsMap: Map<string, HTMLElement>,
): Date | null => {
  if (typeof document === "undefined") return null;

  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return null;

  // Find which date button is under the pointer
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
