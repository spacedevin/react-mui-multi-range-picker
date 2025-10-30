import { describe, test, expect } from 'bun:test';
import {
  mergeOverlappingRanges,
  getRangesAsIndividualDates,
  isDateInRanges,
  areDatesInSameRange,
  hasAdjacentSelectedDate,
  isDateInHoverRange,
  findOverlappingRanges,
  updateRangesWithSelection,
  getAdjacentDate,
  calculateDayRoundingStyleForCalendar,
  findDateElementFromPoint,
  shouldUpdateDragDate,
  commitSelection,
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from './MultiRangeDatePicker';
import type { DateRange } from './types';

describe('MultiRangeDatePicker - Pure Functions', () => {
  describe('mergeOverlappingRanges', () => {
    test('returns empty array for empty input', () => {
      const result = mergeOverlappingRanges([]);
      expect(result).toEqual([]);
    });

    test('returns single range unchanged', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result).toEqual(ranges);
    });

    test('merges overlapping ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-04'), end: new Date('2025-01-10') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-01'));
      expect(result[0].end).toEqual(new Date('2025-01-10'));
    });

    test('merges adjacent ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-06'), end: new Date('2025-01-10') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(1);
    });

    test('does not merge non-overlapping ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(2);
    });
  });

  describe('getRangesAsIndividualDates', () => {
    test('returns empty array for empty input', () => {
      const result = getRangesAsIndividualDates([]);
      expect(result).toEqual([]);
    });

    test('returns all dates in a single range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-03') },
      ];
      const result = getRangesAsIndividualDates(ranges);
      expect(result.length).toBe(3);
    });

    test('returns all dates across multiple ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-02') },
        { start: new Date('2025-01-05'), end: new Date('2025-01-06') },
      ];
      const result = getRangesAsIndividualDates(ranges);
      expect(result.length).toBe(4);
    });

    test('handles single day range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-01') },
      ];
      const result = getRangesAsIndividualDates(ranges);
      expect(result.length).toBe(1);
    });
  });

  describe('isDateInRanges', () => {
    const ranges: DateRange[] = [
      { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
    ];

    test('returns true for date in first range', () => {
      const result = isDateInRanges(new Date('2025-01-03'), ranges);
      expect(result).toBe(true);
    });

    test('returns true for date in second range', () => {
      const result = isDateInRanges(new Date('2025-01-12'), ranges);
      expect(result).toBe(true);
    });

    test('returns false for date outside ranges', () => {
      const result = isDateInRanges(new Date('2025-01-07'), ranges);
      expect(result).toBe(false);
    });

    test('returns true for start date', () => {
      const result = isDateInRanges(new Date('2025-01-01'), ranges);
      expect(result).toBe(true);
    });

    test('returns true for end date', () => {
      const result = isDateInRanges(new Date('2025-01-05'), ranges);
      expect(result).toBe(true);
    });

    test('handles invalid date', () => {
      const result = isDateInRanges(new Date('invalid'), ranges);
      expect(result).toBe(false);
    });

    test('handles empty ranges', () => {
      const result = isDateInRanges(new Date('2025-01-01'), []);
      expect(result).toBe(false);
    });
  });

  describe('areDatesInSameRange', () => {
    const ranges: DateRange[] = [
      { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
    ];

    test('returns true for dates in same range', () => {
      const result = areDatesInSameRange(
        new Date('2025-01-02'),
        new Date('2025-01-04'),
        ranges
      );
      expect(result).toBe(true);
    });

    test('returns false for dates in different ranges', () => {
      const result = areDatesInSameRange(
        new Date('2025-01-02'),
        new Date('2025-01-12'),
        ranges
      );
      expect(result).toBe(false);
    });

    test('returns false when one date is not in any range', () => {
      const result = areDatesInSameRange(
        new Date('2025-01-02'),
        new Date('2025-01-20'),
        ranges
      );
      expect(result).toBe(false);
    });

    test('handles invalid dates', () => {
      const result = areDatesInSameRange(
        new Date('invalid'),
        new Date('2025-01-02'),
        ranges
      );
      expect(result).toBe(false);
    });
  });

  describe('hasAdjacentSelectedDate', () => {
    const ranges: DateRange[] = [
      { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
    ];

    test('returns true when left date is selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-03'),
        'left',
        ranges
      );
      expect(result).toBe(true);
    });

    test('returns true when right date is selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-03'),
        'right',
        ranges
      );
      expect(result).toBe(true);
    });

    test('returns false when left date is not selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-01'),
        'left',
        ranges
      );
      expect(result).toBe(false);
    });

    test('returns false when right date is not selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-05'),
        'right',
        ranges
      );
      expect(result).toBe(false);
    });
  });

  describe('isDateInHoverRange', () => {
    test('returns true for date in hover range', () => {
      const result = isDateInHoverRange(
        new Date('2025-01-03'),
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        true
      );
      expect(result).toBe(true);
    });

    test('returns false when not dragging', () => {
      const result = isDateInHoverRange(
        new Date('2025-01-03'),
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        false
      );
      expect(result).toBe(false);
    });

    test('returns false for date outside hover range', () => {
      const result = isDateInHoverRange(
        new Date('2025-01-10'),
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        true
      );
      expect(result).toBe(false);
    });

    test('handles reversed drag dates', () => {
      const result = isDateInHoverRange(
        new Date('2025-01-03'),
        new Date('2025-01-05'),
        new Date('2025-01-01'),
        true
      );
      expect(result).toBe(true);
    });

    test('returns false for null drag dates', () => {
      const result = isDateInHoverRange(
        new Date('2025-01-03'),
        null,
        new Date('2025-01-05'),
        true
      );
      expect(result).toBe(false);
    });
  });

  describe('findOverlappingRanges', () => {
    const ranges: DateRange[] = [
      { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      { start: new Date('2025-01-20'), end: new Date('2025-01-25') },
    ];

    test('finds overlapping ranges', () => {
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-12')
      );
      expect(result).toEqual([0, 1]);
    });

    test('finds single overlapping range', () => {
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-02'),
        new Date('2025-01-04')
      );
      expect(result).toEqual([0]);
    });

    test('returns empty for non-overlapping selection', () => {
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-06'),
        new Date('2025-01-09')
      );
      expect(result).toEqual([]);
    });
  });

  describe('updateRangesWithSelection', () => {
    test('adds new range when no overlap', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-10'),
        new Date('2025-01-15'),
        false
      );
      expect(result.length).toBe(2);
    });

    test('removes overlapping ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-12'),
        false
      );
      expect(result.length).toBe(0);
    });

    test('merges ranges when mergeRanges is true', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-06'),
        new Date('2025-01-10'),
        true
      );
      expect(result.length).toBe(1);
    });

    test('handles reversed dates', () => {
      const ranges: DateRange[] = [];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-10'),
        new Date('2025-01-05'),
        false
      );
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-05'));
      expect(result[0].end).toEqual(new Date('2025-01-10'));
    });
  });

  describe('getAdjacentDate', () => {
    test('returns previous day for left direction', () => {
      const date = new Date('2025-01-15');
      const result = getAdjacentDate(date, 'left');
      expect(result.getDate()).toBe(14);
    });

    test('returns next day for right direction', () => {
      const date = new Date('2025-01-15');
      const result = getAdjacentDate(date, 'right');
      expect(result.getDate()).toBe(16);
    });

    test('handles month boundaries', () => {
      const date = new Date('2025-01-01');
      const result = getAdjacentDate(date, 'left');
      expect(result.getMonth()).toBe(11); // December
      expect(result.getFullYear()).toBe(2024);
    });
  });

  describe('calculateDayRoundingStyleForCalendar', () => {
    test('returns false for both when date not selected', () => {
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-15'),
        [],
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(false);
      expect(result.isInRange).toBe(false);
      expect(result.isHovered).toBe(false);
    });

    test('returns isInRange true for date in range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-15'), end: new Date('2025-01-17') },
      ];
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-16'),
        ranges,
        null,
        null,
        false,
        false
      );
      expect(result.isInRange).toBe(true);
    });

    test('returns isHovered true for date in hover range', () => {
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-16'),
        [],
        new Date('2025-01-15'),
        new Date('2025-01-17'),
        true,
        false
      );
      expect(result.isHovered).toBe(true);
    });

    test('rounds both sides when date is alone', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-15'), end: new Date('2025-01-15') },
      ];
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-15'),
        ranges,
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(true);
      expect(result.shouldRoundRight).toBe(true);
    });

    test('rounds left when right is selected', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-15'), end: new Date('2025-01-17') },
      ];
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-15'),
        ranges,
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(true);
      expect(result.shouldRoundRight).toBe(false);
    });

    test('rounds right when left is selected', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-15'), end: new Date('2025-01-17') },
      ];
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-17'),
        ranges,
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(true);
    });

    test('handles mergeRanges behavior with hover', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = calculateDayRoundingStyleForCalendar(
        new Date('2025-01-06'),
        ranges,
        new Date('2025-01-06'),
        new Date('2025-01-10'),
        true,
        true
      );
      // With mergeRanges true, hovered range should connect to adjacent
      expect(result.isHovered).toBe(true);
    });
  });

  describe('shouldUpdateDragDate', () => {
    test('returns true when current date is null', () => {
      const result = shouldUpdateDragDate(null, new Date('2025-01-15'));
      expect(result).toBe(true);
    });

    test('returns false when dates are same day', () => {
      const result = shouldUpdateDragDate(
        new Date('2025-01-15T10:00:00'),
        new Date('2025-01-15T14:00:00')
      );
      expect(result).toBe(false);
    });

    test('returns true when dates are different days', () => {
      const result = shouldUpdateDragDate(
        new Date('2025-01-15'),
        new Date('2025-01-16')
      );
      expect(result).toBe(true);
    });

    test('returns false when new date is invalid', () => {
      const result = shouldUpdateDragDate(
        new Date('2025-01-15'),
        new Date('invalid')
      );
      expect(result).toBe(false);
    });
  });

  describe('commitSelection', () => {
    test('returns null for invalid dates', () => {
      const result = commitSelection(null, null, [], false);
      expect(result).toBe(null);
    });

    test('returns updated ranges for valid selection', () => {
      const result = commitSelection(
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        [],
        false
      );
      expect(result).not.toBe(null);
      expect(result?.length).toBe(1);
    });

    test('calls onChange callback', () => {
      let called = false;
      const onChange = () => { called = true; };
      commitSelection(
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        [],
        false,
        onChange
      );
      expect(called).toBe(true);
    });

    test('calls onIndividualDatesChange when provided', () => {
      let calledDates: Date[] = [];
      const onIndividualDatesChange = (dates: Date[]) => { calledDates = dates; };
      commitSelection(
        new Date('2025-01-01'),
        new Date('2025-01-03'),
        [],
        false,
        undefined,
        onIndividualDatesChange,
        true
      );
      expect(calledDates.length).toBe(3);
    });
  });

  describe('handlePointerDownLogic', () => {
    test('returns drag state for valid date', () => {
      const result = handlePointerDownLogic(new Date('2025-01-15'));
      expect(result).not.toBe(null);
      expect(result?.dragStart).toEqual(new Date('2025-01-15'));
      expect(result?.dragEnd).toEqual(new Date('2025-01-15'));
    });

    test('returns null for invalid date', () => {
      const result = handlePointerDownLogic(new Date('invalid'));
      expect(result).toBe(null);
    });
  });

  describe('handlePointerMoveLogic', () => {
    test('returns new date when dragging', () => {
      const result = handlePointerMoveLogic(
        new Date('2025-01-16'),
        true,
        new Date('2025-01-15'),
        new Date('2025-01-15')
      );
      expect(result).not.toBe(null);
    });

    test('returns null when not dragging', () => {
      const result = handlePointerMoveLogic(
        new Date('2025-01-16'),
        false,
        new Date('2025-01-15'),
        new Date('2025-01-15')
      );
      expect(result).toBe(null);
    });

    test('returns null when same day', () => {
      const result = handlePointerMoveLogic(
        new Date('2025-01-15T14:00:00'),
        true,
        new Date('2025-01-15T10:00:00'),
        new Date('2025-01-15T10:00:00')
      );
      expect(result).toBe(null);
    });
  });
});
