import { describe, test, expect } from 'bun:test';
import type { DateRange, MultiRangeDatePickerProps } from './types';

describe('Types', () => {
  describe('DateRange', () => {
    test('DateRange has start and end properties', () => {
      const range: DateRange = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-05'),
      };

      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
      expect(range.start.getTime()).toBeLessThan(range.end.getTime());
    });

    test('DateRange can have same start and end', () => {
      const sameDay = new Date('2025-01-01');
      const range: DateRange = {
        start: sameDay,
        end: sameDay,
      };

      expect(range.start).toBe(range.end);
    });

    test('DateRange dates can be in any order', () => {
      const range: DateRange = {
        start: new Date('2025-01-05'),
        end: new Date('2025-01-01'),
      };

      // Type system allows this, component should handle
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });
  });

  describe('MultiRangeDatePickerProps', () => {
    test('all props are optional', () => {
      const props: MultiRangeDatePickerProps = {};
      expect(props).toEqual({});
    });

    test('onChange prop accepts callback', () => {
      const onChange = (ranges: DateRange[]) => {
        expect(Array.isArray(ranges)).toBe(true);
      };

      const props: MultiRangeDatePickerProps = {
        onChange,
      };

      expect(typeof props.onChange).toBe('function');
    });

    test('onIndividualDatesChange prop accepts callback', () => {
      const onIndividualDatesChange = (dates: Date[]) => {
        expect(Array.isArray(dates)).toBe(true);
      };

      const props: MultiRangeDatePickerProps = {
        onIndividualDatesChange,
      };

      expect(typeof props.onIndividualDatesChange).toBe('function');
    });

    test('mergeRanges prop is boolean', () => {
      const props1: MultiRangeDatePickerProps = {
        mergeRanges: true,
      };
      const props2: MultiRangeDatePickerProps = {
        mergeRanges: false,
      };

      expect(typeof props1.mergeRanges).toBe('boolean');
      expect(typeof props2.mergeRanges).toBe('boolean');
    });

    test('returnIndividualDates prop is boolean', () => {
      const props1: MultiRangeDatePickerProps = {
        returnIndividualDates: true,
      };
      const props2: MultiRangeDatePickerProps = {
        returnIndividualDates: false,
      };

      expect(typeof props1.returnIndividualDates).toBe('boolean');
      expect(typeof props2.returnIndividualDates).toBe('boolean');
    });

    test('can combine all props', () => {
      const onChange = (ranges: DateRange[]) => {};
      const onIndividualDatesChange = (dates: Date[]) => {};

      const props: MultiRangeDatePickerProps = {
        onChange,
        onIndividualDatesChange,
        mergeRanges: true,
        returnIndividualDates: true,
      };

      expect(typeof props.onChange).toBe('function');
      expect(typeof props.onIndividualDatesChange).toBe('function');
      expect(props.mergeRanges).toBe(true);
      expect(props.returnIndividualDates).toBe(true);
    });
  });
});

