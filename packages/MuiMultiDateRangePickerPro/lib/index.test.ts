import { describe, test, expect } from 'bun:test';
import { MultiRangeDatePicker } from './index';
import type { DateRange } from './index';

describe('Package Exports', () => {
  test('exports MultiRangeDatePicker as named export', () => {
    expect(MultiRangeDatePicker).toBeDefined();
    expect(typeof MultiRangeDatePicker).toBe('function');
  });

  test('exports DateRange type', () => {
    const testRange: DateRange = {
      start: new Date(),
      end: new Date(),
    };

    expect(testRange).toBeDefined();
    expect(testRange.start).toBeInstanceOf(Date);
    expect(testRange.end).toBeInstanceOf(Date);
  });

  test('component is a React component', () => {
    // React components are functions or classes
    expect(typeof MultiRangeDatePicker).toBe('function');
  });
});

