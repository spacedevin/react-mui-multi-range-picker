# Testing Guide

This project uses [Bun](https://bun.sh) as the test runner for fast, reliable tests with built-in TypeScript support.

## Prerequisites

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

## Running Tests

### Free Package

```bash
cd packages/MuiMultiDateRangePicker

# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run in watch mode
bun test --watch
```

### Pro Package

```bash
cd packages/MuiMultiDateRangePickerPro

# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run in watch mode
bun test --watch
```

## Test Structure

### Free Package Tests

- **`lib/MultiRangeDatePicker.test.tsx`** - Component tests (37 tests)
  - Rendering tests
  - Callback tests
  - Merge ranges functionality
  - Props validation
  - Accessibility tests
  - Pointer event handling
  - Date range operations
  - Performance tests

- **`lib/types.test.ts`** - TypeScript type tests (9 tests)
- **`lib/index.test.ts`** - Package export tests (3 tests)

**Coverage:** ~84% lines, ~81% functions

### Pro Package Tests

- **`lib/MultiRangeDatePicker.test.tsx`** - Component tests (32 tests)
  - Rendering tests
  - Callback tests
  - Chip management
  - Merge ranges functionality
  - Props validation
  - Accessibility tests
  - UI component tests

- **`lib/types.test.ts`** - TypeScript type tests (9 tests)
- **`lib/index.test.ts`** - Package export tests (3 tests)

**Coverage:** ~74% lines, ~69% functions

## Test Environment

- **Test Runner:** Bun test
- **DOM Environment:** happy-dom
- **Testing Library:** @testing-library/react
- **Mocking:** Bun's built-in `mock()` function

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions before releasing packages to NPM. The CI pipeline will fail if any tests fail.

## Writing Tests

When adding new features, follow these guidelines:

1. **Component Tests:** Test rendering, props, callbacks, and user interactions
2. **Type Tests:** Verify TypeScript interfaces and types work correctly
3. **Integration Tests:** Test how components work with MUI and date-fns
4. **Accessibility Tests:** Ensure ARIA attributes and keyboard navigation

Example test:
```typescript
import { describe, test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiRangeDatePicker from './MultiRangeDatePicker';

describe('MyFeature', () => {
  test('should work correctly', () => {
    const { container } = render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MultiRangeDatePicker />
      </LocalizationProvider>
    );
    
    expect(container).toBeTruthy();
  });
});
```

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure you're using the same Bun version as CI
- Run `bun install` to update dependencies

### Coverage is lower than expected
- Check if happy-dom supports the DOM APIs you're testing
- Some pointer event simulations may not work in happy-dom

### Import errors
- Make sure all test files import from the correct paths
- Named exports should use `import { X } from './module'`
- Default exports should use `import X from './module'`

