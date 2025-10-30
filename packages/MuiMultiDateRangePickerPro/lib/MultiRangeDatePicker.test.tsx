import { describe, test, expect } from 'bun:test';
import {
  mergeOverlappingRanges,
  getRangesAsIndividualDates,
  isDateInRanges,
  isDateInCurrentRange,
  hasAdjacentSelectedDate,
  findOverlappingRanges,
  updateRangesWithSelection,
  removeRangeByIndex,
  getAdjacentDate,
  calculateDayRoundingStyle,
  findDateElementFromPoint,
  shouldUpdateDragDate,
  commitDragSelection,
  handleRangeChangeLogic,
  handlePointerDownLogic,
  handlePointerMoveLogic,
  handleRemoveRangeLogic,
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

    test('handles unsorted ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(2);
      expect(result[0].start).toEqual(new Date('2025-01-01'));
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

  describe('isDateInCurrentRange', () => {
    test('returns true for date in picker range', () => {
      const currentRange: [Date, Date] = [new Date('2025-01-01'), new Date('2025-01-05')];
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        currentRange,
        null,
        null,
        false
      );
      expect(result).toBe(true);
    });

    test('returns true for date in drag range', () => {
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        [null, null],
        new Date('2025-01-01'),
        new Date('2025-01-05'),
        true
      );
      expect(result).toBe(true);
    });

    test('returns false when not dragging and no current range', () => {
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        [null, null],
        null,
        null,
        false
      );
      expect(result).toBe(false);
    });

    test('handles reversed date range', () => {
      const currentRange: [Date, Date] = [new Date('2025-01-05'), new Date('2025-01-01')];
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        currentRange,
        null,
        null,
        false
      );
      expect(result).toBe(true);
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
        ranges,
        [null, null],
        null,
        null,
        false
      );
      expect(result).toBe(true);
    });

    test('returns true when right date is selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-03'),
        'right',
        ranges,
        [null, null],
        null,
        null,
        false
      );
      expect(result).toBe(true);
    });

    test('returns false when left date is not selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-01'),
        'left',
        ranges,
        [null, null],
        null,
        null,
        false
      );
      expect(result).toBe(false);
    });

    test('returns false when right date is not selected', () => {
      const result = hasAdjacentSelectedDate(
        new Date('2025-01-05'),
        'right',
        ranges,
        [null, null],
        null,
        null,
        false
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

    test('finds range contained within selection', () => {
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-09'),
        new Date('2025-01-16')
      );
      expect(result).toEqual([1]);
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

  describe('removeRangeByIndex', () => {
    test('removes range at index', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
        { start: new Date('2025-01-20'), end: new Date('2025-01-25') },
      ];
      const result = removeRangeByIndex(ranges, 1);
      expect(result.length).toBe(2);
      expect(result[0].start).toEqual(new Date('2025-01-01'));
      expect(result[1].start).toEqual(new Date('2025-01-20'));
    });

    test('removes first range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = removeRangeByIndex(ranges, 0);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-10'));
    });

    test('removes last range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = removeRangeByIndex(ranges, 1);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-01'));
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

  describe('calculateDayRoundingStyle', () => {
    test('returns false for both when date not selected', () => {
      const result = calculateDayRoundingStyle(
        new Date('2025-01-15'),
        [],
        [null, null],
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(false);
    });

    test('rounds both sides when date is alone', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-15'), end: new Date('2025-01-15') },
      ];
      const result = calculateDayRoundingStyle(
        new Date('2025-01-15'),
        ranges,
        [null, null],
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
      const result = calculateDayRoundingStyle(
        new Date('2025-01-15'),
        ranges,
        [null, null],
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
      const result = calculateDayRoundingStyle(
        new Date('2025-01-17'),
        ranges,
        [null, null],
        null,
        null,
        false,
        false
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(true);
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

  describe('commitDragSelection', () => {
    test('returns null for invalid dates', () => {
      const result = commitDragSelection(null, null, [], false);
      expect(result).toBe(null);
    });

    test('returns updated ranges for valid selection', () => {
      const result = commitDragSelection(
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
      commitDragSelection(
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
      commitDragSelection(
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

  describe('handleRangeChangeLogic', () => {
    test('returns shouldUpdate false when dragging', () => {
      const result = handleRangeChangeLogic(
        [new Date('2025-01-01'), new Date('2025-01-05')],
        true,
        [],
        false
      );
      expect(result.shouldUpdate).toBe(false);
    });

    test('returns shouldUpdate true with complete range', () => {
      const result = handleRangeChangeLogic(
        [new Date('2025-01-01'), new Date('2025-01-05')],
        false,
        [],
        false
      );
      expect(result.shouldUpdate).toBe(true);
      expect(result.updatedRanges).toBeDefined();
    });

    test('returns shouldUpdate false for incomplete range', () => {
      const result = handleRangeChangeLogic(
        [new Date('2025-01-01'), null],
        false,
        [],
        false
      );
      expect(result.shouldUpdate).toBe(true);
      expect(result.updatedRanges).toBeUndefined();
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

  describe('handleRemoveRangeLogic', () => {
    test('removes range and returns updated array', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = handleRemoveRangeLogic(0, ranges);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-10'));
    });

    test('calls onChange callback', () => {
      let called = false;
      const onChange = () => { called = true; };
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      handleRemoveRangeLogic(0, ranges, onChange);
      expect(called).toBe(true);
    });

    test('calls onIndividualDatesChange when provided', () => {
      let calledDates: Date[] = [];
      const onIndividualDatesChange = (dates: Date[]) => { calledDates = dates; };
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-03') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-12') },
      ];
      handleRemoveRangeLogic(0, ranges, undefined, onIndividualDatesChange, true);
      expect(calledDates.length).toBe(3);
    });
  });
});
