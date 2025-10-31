import { isWithinInterval, startOfDay, isValid } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Merges overlapping or adjacent date ranges into consolidated ranges.
 * Ranges are first sorted by start date, then merged if they overlap or are adjacent.
 */
export const mergeOverlappingRanges = (ranges: DateRange[]): DateRange[] => {
  if (ranges.length <= 1) return ranges;
  
  const sorted = [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: DateRange[] = [];
  let current = sorted[0];
  
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    const currentEnd = new Date(current.end);
    currentEnd.setDate(currentEnd.getDate() + 1);
    
    if (next.start <= currentEnd) {
      current = {
        start: current.start,
        end: next.end > current.end ? next.end : current.end,
      };
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);
  
  return merged;
};

/**
 * Finds indices of ranges that overlap with the given selection.
 * Returns an array of indices for ranges that have any overlap with the selection.
 */
export const findOverlappingRanges = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date
): number[] => {
  const overlappingIndices: number[] = [];
  dateRanges.forEach((range, index) => {
    try {
      const rangeStart = startOfDay(range.start);
      const rangeEnd = startOfDay(range.end);
      const normSelectionStart = startOfDay(selectionStart);
      const normSelectionEnd = startOfDay(selectionEnd);

      const hasOverlap = 
        isWithinInterval(normSelectionStart, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(normSelectionEnd, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(rangeStart, { start: normSelectionStart, end: normSelectionEnd }) ||
        isWithinInterval(rangeEnd, { start: normSelectionStart, end: normSelectionEnd });

      if (hasOverlap) {
        overlappingIndices.push(index);
      }
    } catch {}
  });
  return overlappingIndices;
};

/**
 * Converts date ranges into an array of individual dates.
 * Each date in each range is included in the output array.
 */
export const getRangesAsIndividualDates = (ranges: DateRange[]): Date[] => {
  const dates: Date[] = [];
  ranges.forEach((range) => {
    const current = new Date(range.start);
    while (current <= range.end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });
  return dates;
};

/**
 * Updates ranges by toggling the selection.
 * If the new selection overlaps existing ranges, those ranges are removed (deselection).
 * If the new selection doesn't overlap, it's added as a new range.
 * Optionally merges overlapping ranges after the update.
 */
export const updateRangesWithSelection = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date,
  shouldMergeRanges: boolean
): DateRange[] => {
  const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
  const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;

  const overlappingIndices = findOverlappingRanges(dateRanges, start, end);

  let updatedRanges: DateRange[];
  
  if (overlappingIndices.length > 0) {
    // Remove overlapping ranges (deselection)
    updatedRanges = dateRanges.filter((_, index) => !overlappingIndices.includes(index));
  } else {
    // Add new range (selection)
    const newRange: DateRange = {
      start: startOfDay(start),
      end: startOfDay(end),
    };
    updatedRanges = [...dateRanges, newRange];
  }

  if (shouldMergeRanges) {
    updatedRanges = mergeOverlappingRanges(updatedRanges);
  }

  return updatedRanges;
};

