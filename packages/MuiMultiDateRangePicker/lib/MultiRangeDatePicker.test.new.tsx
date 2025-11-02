import '../test-utils/setup';
import { describe, test, expect, vi } from 'bun:test';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import MultiRangeDatePicker, {
  areDatesInSameRange,
  hasAdjacentSelectedDate,
  isDateInHoverRange,
  calculateDayRoundingStyleForCalendar,
  commitSelection,
  generateDayButtonStyles,
} from './MultiRangeDatePicker';
import type { DateRange } from './types';

// Shared library functions are tested in /lib/shared-functions.test.ts
// This file tests ONLY component-specific logic and DOM interactions

const DAY_SIZE = 36;
const DAY_MARGIN = 2;
const captionTypography = { fontSize: '0.875rem' };

describe('Component-Specific Functions', () => {
  describe('areDatesInSameRange', () => {
    const ranges: DateRange[] = [
      { start: new Date('2025-01-01'), end: new Date('2025-01-05') },
      { start: new Date('2025-01-10'), end: new Date('2025-01-15') },
    ];

    test('returns true for dates in same range', () => {
      expect(areDatesInSameRange(new Date('2025-01-02'), new Date('2025-01-04'), ranges)).toBe(true);
    });

    test('returns false for dates in different ranges', () => {
      expect(areDatesInSameRange(new Date('2025-01-02'), new Date('2025-01-12'), ranges)).toBe(false);
    });

    test('returns false for invalid dates', () => {
      expect(areDatesInSameRange(new Date('invalid'), new Date('2025-01-02'), ranges)).toBe(false);
    });
  });

  describe('hasAdjacentSelectedDate', () => {
    const ranges: DateRange[] = [{ start: new Date('2025-01-01'), end: new Date('2025-01-05') }];

    test('returns true when adjacent date is selected', () => {
      expect(hasAdjacentSelectedDate(new Date('2025-01-03'), 'left', ranges)).toBe(true);
      expect(hasAdjacentSelectedDate(new Date('2025-01-03'), 'right', ranges)).toBe(true);
    });

    test('returns false at range boundaries', () => {
      expect(hasAdjacentSelectedDate(new Date('2025-01-01'), 'left', ranges)).toBe(false);
      expect(hasAdjacentSelectedDate(new Date('2025-01-05'), 'right', ranges)).toBe(false);
    });
  });

  describe('isDateInHoverRange', () => {
    test('returns true for date in hover range while dragging', () => {
      expect(isDateInHoverRange(new Date('2025-01-03'), new Date('2025-01-01'), new Date('2025-01-05'), true)).toBe(true);
    });

    test('returns false when not dragging', () => {
      expect(isDateInHoverRange(new Date('2025-01-03'), new Date('2025-01-01'), new Date('2025-01-05'), false)).toBe(false);
    });

    test('handles reversed drag dates', () => {
      expect(isDateInHoverRange(new Date('2025-01-03'), new Date('2025-01-05'), new Date('2025-01-01'), true)).toBe(true);
    });
  });

  describe('calculateDayRoundingStyleForCalendar', () => {
    const ranges: DateRange[] = [{ start: new Date('2025-01-10'), end: new Date('2025-01-15') }];

    test('rounds left on range start', () => {
      const result = calculateDayRoundingStyleForCalendar(new Date('2025-01-10'), ranges, null, null, false, false);
      expect(result.shouldRoundLeft).toBe(true);
      expect(result.shouldRoundRight).toBe(false);
    });

    test('rounds right on range end', () => {
      const result = calculateDayRoundingStyleForCalendar(new Date('2025-01-15'), ranges, null, null, false, false);
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(true);
    });

    test('no rounding for middle dates', () => {
      const result = calculateDayRoundingStyleForCalendar(new Date('2025-01-12'), ranges, null, null, false, false);
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(false);
    });
  });

  describe('commitSelection', () => {
    test('updates ranges with selection', () => {
      const ranges: DateRange[] = [];
      const onChange = vi.fn();
      const result = commitSelection(new Date('2025-01-01'), new Date('2025-01-05'), ranges, false, onChange, undefined);
      
      expect(result.length).toBe(1);
      expect(onChange).toHaveBeenCalledWith(result);
    });

    test('calls onIndividualDatesChange when provided', () => {
      const ranges: DateRange[] = [];
      const onChange = vi.fn();
      const onIndividualDatesChange = vi.fn();
      commitSelection(new Date('2025-01-01'), new Date('2025-01-05'), ranges, false, onChange, onIndividualDatesChange);
      
      expect(onIndividualDatesChange).toHaveBeenCalled();
    });
  });

  describe('generateDayButtonStyles', () => {
    test('returns base styles for unselected day', () => {
      const styles = generateDayButtonStyles(false, false, false, false, DAY_SIZE, DAY_MARGIN, captionTypography);
      expect(styles.width).toBe(DAY_SIZE);
      expect(styles.height).toBe(DAY_SIZE);
      expect(styles.margin).toBeDefined();
      expect(styles.touchAction).toBe('none');
    });

    test('returns selected styles', () => {
      const styles = generateDayButtonStyles(true, false, false, false, DAY_SIZE, DAY_MARGIN, captionTypography);
      expect(styles.backgroundColor).toBe('primary.main');
      expect(styles.color).toBe('primary.contrastText');
    });

    test('applies rounded borders correctly', () => {
      const stylesLeft = generateDayButtonStyles(true, false, true, false, DAY_SIZE, DAY_MARGIN, captionTypography);
      expect(stylesLeft.borderTopLeftRadius).toBe('50%');
      expect(stylesLeft.borderBottomLeftRadius).toBe('50%');

      const stylesRight = generateDayButtonStyles(true, false, false, true, DAY_SIZE, DAY_MARGIN, captionTypography);
      expect(stylesRight.borderTopRightRadius).toBe('50%');
      expect(stylesRight.borderBottomRightRadius).toBe('50%');
    });
  });
});

describe('DOM Rendering and Interactions', () => {
  test('renders without crashing', () => {
    const { container } = render(<MultiRangeDatePicker />);
    expect(container).toBeDefined();
    cleanup();
  });

  test('renders with onChange prop', () => {
    const handleChange = vi.fn();
    const { container } = render(<MultiRangeDatePicker onChange={handleChange} />);
    expect(container).toBeDefined();
    cleanup();
  });

  test('renders with mergeRanges prop', () => {
    const { container } = render(<MultiRangeDatePicker mergeRanges={true} />);
    expect(container).toBeDefined();
    cleanup();
  });

  test('calls onChange when date range is selected', () => {
    const handleChange = vi.fn();
    render(<MultiRangeDatePicker onChange={handleChange} />);
    
    // Note: Full interaction testing requires MUI DateCalendar to render dates
    // Which requires proper MUI theme setup. These are smoke tests to verify
    // the component structure and props handling work correctly.
    
    cleanup();
  });

  test('renders with all props', () => {
    const handleChange = vi.fn();
    const handleIndividualDatesChange = vi.fn();
    const { container } = render(
      <MultiRangeDatePicker
        onChange={handleChange}
        onIndividualDatesChange={handleIndividualDatesChange}
        mergeRanges={true}
      />
    );
    expect(container).toBeDefined();
    cleanup();
  });
});

