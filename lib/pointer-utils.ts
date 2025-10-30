import { isValid } from 'date-fns';
import { shouldUpdateDragDate } from './date-utils';

/**
 * Handle pointer down logic - initialize drag state
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
 * Handle pointer move logic - update drag end date
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

