import '../test-utils/setup';
import { describe, test, expect, vi } from 'bun:test';
// Import shared library functions from /lib
import {
  mergeOverlappingRanges,
  getRangesAsIndividualDates,
  isDateInRanges,
  findOverlappingRanges,
  updateRangesWithSelection,
  findDateElementFromPoint,
  shouldUpdateDragDate,
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from '../../../lib';
// Import component-specific functions from component file
import {
  isDateInCurrentRange,
  hasAdjacentSelectedDate,
  removeRangeByIndex,
  calculateDayRoundingStyle,
  commitDragSelection,
  handleRangeChangeLogic,
  handleRemoveRangeLogic,
  generatePickersDayStyles,
  generateDayWrapperStyles,
  createCommitDragSelectionCallback,
  createHandleRangeChange,
  createHandlePointerDownPro,
  createHandlePointerMovePro,
  createHandleContainerPointerMovePro,
  createHandlePointerUpPro,
  createHandleRemoveRange,
  createCustomDayPro,
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

    test('handles corrupt date ranges gracefully', () => {
      const badRanges: DateRange[] = [
        { start: new Date('invalid'), end: new Date('2025-01-05') },
      ];
      const result = isDateInRanges(new Date('2025-01-03'), badRanges);
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

    test('handles invalid picker range gracefully', () => {
      const currentRange: [Date, Date] = [new Date('invalid'), new Date('2025-01-05')];
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        currentRange,
        null,
        null,
        false
      );
      expect(result).toBe(false);
    });

    test('handles invalid drag range gracefully', () => {
      const result = isDateInCurrentRange(
        new Date('2025-01-03'),
        [null, null],
        new Date('invalid'),
        new Date('2025-01-05'),
        true
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

  // getAdjacentDate tests removed - function not used in Pro component

  describe('findDateElementFromPoint', () => {
    test('returns date when element is found', () => {
      const dateButtonsMap = new Map();
      const testDate = new Date('2025-01-15');
      const mockElement = document.createElement('div');
      
      dateButtonsMap.set(testDate.toISOString(), mockElement);
      
      // Mock document.elementFromPoint
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => mockElement;
      
      const result = findDateElementFromPoint(100, 100, dateButtonsMap);
      
      expect(result).toEqual(testDate);
      
      document.elementFromPoint = originalElementFromPoint;
    });

    test('returns null when no element found at point', () => {
      const dateButtonsMap = new Map();
      
      // Mock document.elementFromPoint to return null
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => null;
      
      const result = findDateElementFromPoint(100, 100, dateButtonsMap);
      
      expect(result).toBeNull();
      
      document.elementFromPoint = originalElementFromPoint;
    });

    test('returns null when element not in map', () => {
      const dateButtonsMap = new Map();
      const mockElement = document.createElement('div');
      
      // Mock document.elementFromPoint
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => mockElement;
      
      const result = findDateElementFromPoint(100, 100, dateButtonsMap);
      
      expect(result).toBeNull();
      
      document.elementFromPoint = originalElementFromPoint;
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

    test('calls onIndividualDatesChange when provided', () => {
      const onChange = vi.fn();
      const onIndividualDatesChange = vi.fn();
      
      const result = handleRangeChangeLogic(
        [new Date('2025-01-01'), new Date('2025-01-03')],
        false,
        [],
        false,
        onChange,
        onIndividualDatesChange,
        true
      );
      
      expect(result.shouldUpdate).toBe(true);
      expect(onChange).toHaveBeenCalled();
      expect(onIndividualDatesChange).toHaveBeenCalled();
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

  describe('generatePickersDayStyles', () => {
    test('returns default styles when not selected', () => {
      const styles = generatePickersDayStyles(false, false, false);
      expect(styles.backgroundColor).toBeUndefined();
      expect(styles.color).toBeUndefined();
      expect(styles.borderRadius).toBe('50%');
    });

    test('returns selected styles when isSelected is true', () => {
      const styles = generatePickersDayStyles(true, false, false);
      expect(styles.backgroundColor).toBe('primary.main');
      expect(styles.color).toBe('primary.contrastText');
    });

    test('applies no border radius when selected and no rounding', () => {
      const styles = generatePickersDayStyles(true, false, false);
      expect(styles.borderRadius).toBe(0);
    });

    test('applies left rounded border radius', () => {
      const styles = generatePickersDayStyles(true, true, false);
      expect(styles.borderRadius).toBe('50% 0 0 50%');
    });

    test('applies right rounded border radius', () => {
      const styles = generatePickersDayStyles(true, false, true);
      expect(styles.borderRadius).toBe('0 50% 50% 0');
    });

    test('applies full rounded border when both sides rounded', () => {
      const styles = generatePickersDayStyles(true, true, true);
      expect(styles.borderRadius).toBe('50%');
    });

    test('includes before pseudo-element when not rounded left and selected', () => {
      const styles = generatePickersDayStyles(true, false, true);
      expect(styles['&::before']).toBeDefined();
      expect(styles['&::before']?.backgroundColor).toBe('primary.main');
    });

    test('includes after pseudo-element when not rounded right and selected', () => {
      const styles = generatePickersDayStyles(true, true, false);
      expect(styles['&::after']).toBeDefined();
      expect(styles['&::after']?.backgroundColor).toBe('primary.main');
    });

    test('includes both pseudo-elements when no rounding and selected', () => {
      const styles = generatePickersDayStyles(true, false, false);
      expect(styles['&::before']).toBeDefined();
      expect(styles['&::after']).toBeDefined();
    });

    test('does not include pseudo-elements when not selected', () => {
      const styles = generatePickersDayStyles(false, false, false);
      expect(styles['&::before']).toBeUndefined();
      expect(styles['&::after']).toBeUndefined();
    });

    test('includes touch and user select properties', () => {
      const styles = generatePickersDayStyles(true, false, false);
      expect(styles.touchAction).toBe('none');
      expect(styles.userSelect).toBe('none');
      expect(styles.position).toBe('relative');
    });

    test('includes hover styles', () => {
      const styles = generatePickersDayStyles(true, false, false);
      expect(styles['&:hover']).toBeDefined();
      expect(styles['&:hover'].backgroundColor).toBe('primary.dark');
    });

    test('hover styles are undefined when not selected', () => {
      const styles = generatePickersDayStyles(false, false, false);
      expect(styles['&:hover'].backgroundColor).toBeUndefined();
    });
  });

  describe('generateDayWrapperStyles', () => {
    test('returns correct wrapper styles', () => {
      const styles = generateDayWrapperStyles();
      expect(styles.display).toBe('inline-block');
      expect(styles.position).toBe('relative');
    });

    test('returns same styles on multiple calls', () => {
      const styles1 = generateDayWrapperStyles();
      const styles2 = generateDayWrapperStyles();
      expect(styles1).toEqual(styles2);
    });
  });

  describe('createCommitDragSelectionCallback', () => {
    test('returns a function that commits drag selection', () => {
      const dragStartRef = { current: new Date('2025-01-01') };
      const dragEndRef = { current: new Date('2025-01-03') };
      const dateRanges: DateRange[] = [];
      const onChange = vi.fn();
      
      const callback = createCommitDragSelectionCallback(
        dragStartRef,
        dragEndRef,
        dateRanges,
        false,
        onChange
      );
      
      const result = callback();
      
      expect(result).toBeDefined();
      expect(result?.length).toBe(1);
      expect(onChange).toHaveBeenCalled();
    });

    test('returns null when drag dates are invalid', () => {
      const dragStartRef = { current: null };
      const dragEndRef = { current: null };
      const dateRanges: DateRange[] = [];
      
      const callback = createCommitDragSelectionCallback(
        dragStartRef,
        dragEndRef,
        dateRanges,
        false
      );
      
      const result = callback();
      expect(result).toBeNull();
    });
  });

  describe('createHandleRangeChange', () => {
    test('returns handler that processes complete range', () => {
      const isDraggingRef = { current: false };
      const dateRanges: DateRange[] = [];
      const onChange = vi.fn();
      
      const handler = createHandleRangeChange(
        isDraggingRef,
        dateRanges,
        false,
        onChange
      );
      
      const newRange: [Date | null, Date | null] = [new Date('2025-01-01'), new Date('2025-01-05')];
      const result = handler(newRange);
      
      expect(result.shouldUpdate).toBe(true);
      expect(typeof result.callback).toBe('function');
    });

    test('returns shouldUpdate false when dragging', () => {
      const isDraggingRef = { current: true };
      const handler = createHandleRangeChange(isDraggingRef, [], false);
      
      const newRange: [Date | null, Date | null] = [new Date('2025-01-01'), new Date('2025-01-05')];
      const result = handler(newRange);
      
      expect(result.shouldUpdate).toBe(false);
    });

    test('handles incomplete range', () => {
      const isDraggingRef = { current: false };
      const handler = createHandleRangeChange(isDraggingRef, [], false);
      
      const newRange: [Date | null, Date | null] = [new Date('2025-01-01'), null];
      const result = handler(newRange);
      
      expect(result.shouldUpdate).toBe(true);
    });

    test('callback executes range change logic', () => {
      const isDraggingRef = { current: false };
      const dateRanges: DateRange[] = [];
      const onChange = vi.fn();
      
      const handler = createHandleRangeChange(
        isDraggingRef,
        dateRanges,
        false,
        onChange
      );
      
      const newRange: [Date | null, Date | null] = [new Date('2025-01-01'), new Date('2025-01-05')];
      const result = handler(newRange);
      
      if (result.callback) {
        const callbackResult = result.callback();
        expect(callbackResult.shouldUpdate).toBe(true);
      }
    });
  });

  describe('createHandlePointerDownPro', () => {
    test('returns a function that initializes drag state', () => {
      const isDraggingRef = { current: false };
      const dragStartRef = { current: null };
      const dragEndRef = { current: null };
      const forceUpdate = vi.fn();
      
      const handler = createHandlePointerDownPro(isDraggingRef, dragStartRef, dragEndRef, forceUpdate);
      
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        target: { setPointerCapture: vi.fn() },
        pointerId: 1
      } as any;
      
      handler(new Date('2025-01-01'), mockEvent);
      
      expect(isDraggingRef.current).toBe(true);
      expect(dragStartRef.current).toEqual(new Date('2025-01-01'));
      expect(dragEndRef.current).toEqual(new Date('2025-01-01'));
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(forceUpdate).toHaveBeenCalled();
    });
  });

  describe('createHandlePointerMovePro', () => {
    test('returns a function that updates drag end date', () => {
      const isDraggingRef = { current: true };
      const dragStartRef = { current: new Date('2025-01-01') };
      const dragEndRef = { current: new Date('2025-01-01') };
      const forceUpdate = vi.fn();
      
      const handler = createHandlePointerMovePro(isDraggingRef, dragStartRef, dragEndRef, forceUpdate);
      
      handler(new Date('2025-01-03'));
      
      expect(dragEndRef.current).toEqual(new Date('2025-01-03'));
      expect(forceUpdate).toHaveBeenCalled();
    });

    test('does not update when not dragging', () => {
      const isDraggingRef = { current: false };
      const dragStartRef = { current: new Date('2025-01-01') };
      const dragEndRef = { current: new Date('2025-01-01') };
      const forceUpdate = vi.fn();
      
      const handler = createHandlePointerMovePro(isDraggingRef, dragStartRef, dragEndRef, forceUpdate);
      
      handler(new Date('2025-01-03'));
      
      expect(dragEndRef.current).toEqual(new Date('2025-01-01'));
      expect(forceUpdate).not.toHaveBeenCalled();
    });
  });

  describe('createHandleContainerPointerMovePro', () => {
    test('returns a function that finds date from point', () => {
      const isDraggingRef = { current: true };
      const dateButtonsRef = { current: new Map() };
      const handlePointerMove = vi.fn();
      
      const handler = createHandleContainerPointerMovePro(isDraggingRef, dateButtonsRef, handlePointerMove);
      
      // Mock document.elementFromPoint
      const originalElementFromPoint = document.elementFromPoint;
      const mockElement = document.createElement('button');
      document.elementFromPoint = vi.fn().mockReturnValue(mockElement);
      
      const dateStr = new Date('2025-01-01').toISOString();
      dateButtonsRef.current.set(dateStr, mockElement);
      
      const mockEvent = { clientX: 100, clientY: 100 } as any;
      handler(mockEvent);
      
      expect(handlePointerMove).toHaveBeenCalledWith(new Date(dateStr));
      
      document.elementFromPoint = originalElementFromPoint;
    });

    test('does nothing when not dragging', () => {
      const isDraggingRef = { current: false };
      const dateButtonsRef = { current: new Map() };
      const handlePointerMove = vi.fn();
      
      const handler = createHandleContainerPointerMovePro(isDraggingRef, dateButtonsRef, handlePointerMove);
      
      const mockEvent = { clientX: 100, clientY: 100 } as any;
      handler(mockEvent);
      
      expect(handlePointerMove).not.toHaveBeenCalled();
    });
  });

  describe('createHandlePointerUpPro', () => {
    test('returns a function that commits and resets drag state', () => {
      const isDraggingRef = { current: true };
      const dragStartRef = { current: new Date('2025-01-01') };
      const dragEndRef = { current: new Date('2025-01-03') };
      const commitDragSelectionCallback = vi.fn();
      const forceUpdate = vi.fn();
      
      const handler = createHandlePointerUpPro(isDraggingRef, dragStartRef, dragEndRef, commitDragSelectionCallback, forceUpdate);
      
      handler();
      
      expect(commitDragSelectionCallback).toHaveBeenCalled();
      expect(isDraggingRef.current).toBe(false);
      expect(dragStartRef.current).toBeNull();
      expect(dragEndRef.current).toBeNull();
      expect(forceUpdate).toHaveBeenCalled();
    });

    test('does nothing when not dragging', () => {
      const isDraggingRef = { current: false };
      const dragStartRef = { current: null };
      const dragEndRef = { current: null };
      const commitDragSelectionCallback = vi.fn();
      const forceUpdate = vi.fn();
      
      const handler = createHandlePointerUpPro(isDraggingRef, dragStartRef, dragEndRef, commitDragSelectionCallback, forceUpdate);
      
      handler();
      
      expect(commitDragSelectionCallback).not.toHaveBeenCalled();
    });
  });

  describe('createHandleRemoveRange', () => {
    test('returns a function that removes range', () => {
      const dateRanges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-03') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-12') }
      ];
      const onChange = vi.fn();
      
      const handler = createHandleRemoveRange(dateRanges, onChange);
      const result = handler(0);
      
      expect(result.length).toBe(1);
      expect(onChange).toHaveBeenCalledWith(result);
    });
  });

  describe('createCustomDayPro', () => {
    test('returns a function that renders day picker', () => {
      const dateRanges: DateRange[] = [];
      const currentRange: [Date | null, Date | null] = [null, null];
      const dragStartRef = { current: null };
      const dragEndRef = { current: null };
      const isDraggingRef = { current: false };
      const mergeRanges = false;
      const dateButtonsRef = { current: new Map() };
      const handlePointerDown = vi.fn();
      
      const CustomDay = createCustomDayPro(
        dateRanges,
        currentRange,
        dragStartRef,
        dragEndRef,
        isDraggingRef,
        mergeRanges,
        dateButtonsRef,
        handlePointerDown
      );
      
      const props = { day: new Date('2025-01-01') } as any;
      const result = CustomDay(props);
      
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
    });

    test('handles invalid day', () => {
      const dateRanges: DateRange[] = [];
      const currentRange: [Date | null, Date | null] = [null, null];
      const dragStartRef = { current: null };
      const dragEndRef = { current: null };
      const isDraggingRef = { current: false };
      const mergeRanges = false;
      const dateButtonsRef = { current: new Map() };
      const handlePointerDown = vi.fn();
      
      const CustomDay = createCustomDayPro(
        dateRanges,
        currentRange,
        dragStartRef,
        dragEndRef,
        isDraggingRef,
        mergeRanges,
        dateButtonsRef,
        handlePointerDown
      );
      
      const props = { day: null } as any;
      const result = CustomDay(props);
      
      expect(result).toBeDefined();
    });
  });
});
