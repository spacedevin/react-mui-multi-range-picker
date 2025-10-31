import { describe, test, expect } from 'bun:test';
import {
  mergeOverlappingRanges,
  getRangesAsIndividualDates,
  findOverlappingRanges,
  updateRangesWithSelection,
  type DateRange,
} from './range-utils';

describe('range-utils', () => {
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
        { start: new Date('2025-01-04'), end: new Date('2025-01-12') },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-01'));
      expect(result[0].end).toEqual(new Date('2025-01-15'));
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

  describe('findOverlappingRanges', () => {
    test('returns empty array when no overlaps', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
      ];
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-20'),
        new Date('2025-01-25')
      );
      expect(result).toEqual([]);
    });

    test('returns indices of overlapping ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
        { start: new Date('2025-01-20'), end: new Date('2025-01-25') },
      ];
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-12')
      );
      expect(result).toEqual([0, 1]);
    });

    test('handles selection within a single range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-10') },
      ];
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-07')
      );
      expect(result).toEqual([0]);
    });

    test('handles selection encompassing a range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-05'), end: new Date('2025-01-10') },
      ];
      const result = findOverlappingRanges(
        ranges,
        new Date('2025-01-01'),
        new Date('2025-01-15')
      );
      expect(result).toEqual([0]);
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

    test('removes overlapping range', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-07'),
        false
      );
      expect(result.length).toBe(0);
    });

    test('removes multiple overlapping ranges', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
        { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
        { start: new Date('2025-01-20'), end: new Date('2025-01-25') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-03'),
        new Date('2025-01-12'),
        false
      );
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-20'));
    });

    test('merges ranges when shouldMergeRanges is true', () => {
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
      expect(result[0].start).toEqual(new Date('2025-01-01'));
      expect(result[0].end).toEqual(new Date('2025-01-10'));
    });

    test('does not merge when shouldMergeRanges is false', () => {
      const ranges: DateRange[] = [
        { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-06'),
        new Date('2025-01-10'),
        false
      );
      expect(result.length).toBe(2);
    });

    test('normalizes selection order', () => {
      const ranges: DateRange[] = [];
      const result = updateRangesWithSelection(
        ranges,
        new Date('2025-01-10'),
        new Date('2025-01-05'),
        false
      );
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date('2025-01-05T00:00:00.000Z'));
      expect(result[0].end).toEqual(new Date('2025-01-10T00:00:00.000Z'));
    });
  });
});

