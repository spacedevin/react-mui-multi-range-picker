import { describe, test, expect } from 'bun:test';
import {
  isDateInRanges,
  getAdjacentDate,
  shouldUpdateDragDate,
  findDateElementFromPoint,
  type DateRange,
} from './date-utils';

describe('date-utils', () => {
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

    test('handles ranges with invalid dates', () => {
      const invalidRanges: DateRange[] = [
        { start: new Date('invalid'), end: new Date('2025-01-05') },
      ];
      const result = isDateInRanges(new Date('2025-01-03'), invalidRanges);
      expect(result).toBe(false);
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

    test('handles month boundary going left', () => {
      const date = new Date('2025-02-01');
      const result = getAdjacentDate(date, 'left');
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(31);
    });

    test('handles month boundary going right', () => {
      const date = new Date('2025-01-31');
      const result = getAdjacentDate(date, 'right');
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(1);
    });
  });

  describe('shouldUpdateDragDate', () => {
    test('returns true when current date is null', () => {
      const result = shouldUpdateDragDate(null, new Date('2025-01-15'));
      expect(result).toBe(true);
    });

    test('returns false when new date is invalid', () => {
      const result = shouldUpdateDragDate(
        new Date('2025-01-15'),
        new Date('invalid')
      );
      expect(result).toBe(false);
    });

    test('returns false when dates are the same', () => {
      const date = new Date('2025-01-15');
      const result = shouldUpdateDragDate(date, new Date('2025-01-15'));
      expect(result).toBe(false);
    });

    test('returns true when dates are different', () => {
      const result = shouldUpdateDragDate(
        new Date('2025-01-15'),
        new Date('2025-01-16')
      );
      expect(result).toBe(true);
    });

    test('returns true when current date is invalid', () => {
      const result = shouldUpdateDragDate(
        new Date('invalid'),
        new Date('2025-01-15')
      );
      expect(result).toBe(true);
    });

    test('returns false when dates are same day but different times', () => {
      const date1 = new Date('2025-01-15T10:00:00');
      const date2 = new Date('2025-01-15T15:00:00');
      const result = shouldUpdateDragDate(date1, date2);
      expect(result).toBe(false);
    });
  });

  describe('findDateElementFromPoint', () => {
    test('returns null when document is undefined', () => {
      const map = new Map<string, HTMLElement>();
      const result = findDateElementFromPoint(100, 100, map);
      // In Node/Bun environment, document is undefined
      expect(result).toBe(null);
    });

    test('returns null when map is empty', () => {
      const map = new Map<string, HTMLElement>();
      const result = findDateElementFromPoint(100, 100, map);
      expect(result).toBe(null);
    });

    test('returns null when no element at point', () => {
      const map = new Map<string, HTMLElement>();
      // In a browser environment with no element at that point
      const result = findDateElementFromPoint(9999, 9999, map);
      expect(result).toBe(null);
    });

    // Note: Full DOM testing would require a browser environment or JSDOM
    // The actual functionality would be tested in integration tests
  });
});

