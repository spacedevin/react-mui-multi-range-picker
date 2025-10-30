import '../test-utils/setup';
import { describe, test, expect } from 'bun:test';
import React from 'react';
import { createRoot } from 'react-dom/client';
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

describe('MultiRangeDatePicker - DOM Rendering (happy-dom)', () => {
  test('renders without crashing', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const root = createRoot(container);
    
    // Should not throw
    expect(() => {
      root.render(React.createElement(MultiRangeDatePicker));
    }).not.toThrow();
    
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  });

  test('renders with onChange callback', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    const handleChange = (ranges: DateRange[]) => {
      console.log('Ranges changed:', ranges);
    };
    
    expect(() => {
      root.render(React.createElement(MultiRangeDatePicker, { onChange: handleChange }));
    }).not.toThrow();
    
    root.unmount();
    document.body.removeChild(container);
  });

  test('renders with mergeRanges prop', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    expect(() => {
      root.render(React.createElement(MultiRangeDatePicker, { mergeRanges: true }));
    }).not.toThrow();
    
    root.unmount();
    document.body.removeChild(container);
  });

  test('renders with returnIndividualDates prop', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    expect(() => {
      root.render(React.createElement(MultiRangeDatePicker, { returnIndividualDates: true }));
    }).not.toThrow();
    
    root.unmount();
    document.body.removeChild(container);
  });

  test('renders with all props', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    const handleChange = (ranges: DateRange[]) => {};
    const handleIndividualDatesChange = (dates: Date[]) => {};
    
    expect(() => {
      root.render(
        React.createElement(MultiRangeDatePicker, {
          onChange: handleChange,
          onIndividualDatesChange: handleIndividualDatesChange,
          mergeRanges: true,
          returnIndividualDates: true,
        })
      );
    }).not.toThrow();
    
    root.unmount();
    document.body.removeChild(container);
  });
});

