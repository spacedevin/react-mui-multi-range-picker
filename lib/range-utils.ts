import { isWithinInterval, startOfDay } from 'date-fns';
import type { DateRange } from './date-utils';

/**
 * Merge overlapping or adjacent date ranges
 */
export const mergeOverlappingRanges = (ranges: DateRange[]): DateRange[] => {
  if (ranges.length <= 1) return ranges;

  const sorted = [...ranges].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
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
 * Convert date ranges to individual dates
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
 * Find which ranges overlap with a selection
 */
export const findOverlappingRanges = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date,
): number[] => {
  const overlappingIndices: number[] = [];
  dateRanges.forEach((range, index) => {
    try {
      const rangeStart = startOfDay(range.start);
      const rangeEnd = startOfDay(range.end);
      const normSelectionStart = startOfDay(selectionStart);
      const normSelectionEnd = startOfDay(selectionEnd);

      const hasOverlap =
        isWithinInterval(normSelectionStart, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        isWithinInterval(normSelectionEnd, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        isWithinInterval(rangeStart, {
          start: normSelectionStart,
          end: normSelectionEnd,
        }) ||
        isWithinInterval(rangeEnd, {
          start: normSelectionStart,
          end: normSelectionEnd,
        });

      if (hasOverlap) {
        overlappingIndices.push(index);
      }
    } catch {}
  });
  return overlappingIndices;
};

/**
 * Update ranges with a new selection (add or remove overlapping)
 */
export const updateRangesWithSelection = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date,
  shouldMergeRanges: boolean,
): DateRange[] => {
  const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
  const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;

  const overlappingIndices = findOverlappingRanges(dateRanges, start, end);

  let updatedRanges: DateRange[];

  if (overlappingIndices.length > 0) {
    updatedRanges = dateRanges.filter(
      (_, index) => !overlappingIndices.includes(index),
    );
  } else {
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
