import { isValid } from 'date-fns';
import { shouldUpdateDragDate } from './date-utils';

/**
 * Handles the logic for pointer down events.
 * Initializes drag selection with the clicked date.
 * Returns null if the date is invalid.
 */
export const handlePointerDownLogic = (
  date: Date
): { dragStart: Date; dragEnd: Date } | null => {
  if (!date || !isValid(date)) return null;
  
  return {
    dragStart: date,
    dragEnd: date
  };
};

/**
 * Handles the logic for pointer move events during dragging.
 * Updates the drag end date if the pointer has moved to a different date.
 * Returns the new drag end date if it should be updated, null otherwise.
 */
export const handlePointerMoveLogic = (
  date: Date,
  isDragging: boolean,
  dragStart: Date | null,
  currentDragEnd: Date | null
): Date | null => {
  if (!isDragging || !dragStart) return null;
  if (!date || !isValid(date)) return null;
  
  if (shouldUpdateDragDate(currentDragEnd, date)) {
    return date;
  }
  
  return null;
};

