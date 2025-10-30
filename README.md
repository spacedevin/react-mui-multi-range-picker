# MUI Multi-Range Date Picker

[![codecov](https://codecov.io/gh/spacedevin/mui-date-dragger/branch/main/graph/badge.svg)](https://codecov.io/gh/spacedevin/mui-date-dragger)

React date picker components that allow selecting multiple non-contiguous date ranges with click-and-drag support. Built on top of MUI's date picker components with full theme integration and mobile support.


## 📦 Packages

### [MuiMultiDateRangePicker](./packages/MuiMultiDateRangePicker)

[![npm version](https://img.shields.io/npm/v/@spacedevin/react-mui-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)
[![npm downloads](https://img.shields.io/npm/dm/@spacedevin/react-mui-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)

<img align="right" src="docs/mui-multi-range-date-picker.png" alt="MUI Multi-Range Date Picker" height="250">

A free multi-range date picker built on `@mui/x-date-pickers`.

**Features:**
- ✅ Multi-range selection with drag support
- ✅ Individual date selection support
- ✅ Simple calendar-only interface
- ✅ No commercial license required
- ✅ Perfect for basic multi-range needs

**Links:**
- 📦 [NPM Package](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)
- 📖 [Documentation](./packages/MuiMultiDateRangePicker/README.md)

### [MuiMultiDateRangePickerPro](./packages/MuiMultiDateRangePickerPro) (MUI X Pro)

[![npm version](https://img.shields.io/npm/v/@spacedevin/react-mui-pro-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)
[![npm downloads](https://img.shields.io/npm/dm/@spacedevin/react-mui-pro-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)

<img align="right" src="docs/mui-multi-range-date-picker-pro.png" alt="MUI Multi-Range Date Picker Pro" height="250">

An enhanced version built on `@mui/x-date-pickers-pro`.

**Features:**
- ✅ All features from the free version
- ✅ Multi-range and individual date selection
- ✅ Text input field for manual date entry
- ✅ Visual chip-based range management
- ✅ Delete ranges with chip close buttons
- ⚠️ Requires MUI X Pro license for production

**Links:**
- 📦 [NPM Package](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)
- 📖 [Documentation](./packages/MuiMultiDateRangePickerPro/README.md)

## 🚀 Quick Start

### Installation

```bash
# Free version
npm install @spacedevin/react-mui-multi-range-picker

# Pro version (requires MUI X Pro license)
npm install @spacedevin/react-mui-pro-multi-range-picker
```

### Usage

**Basic Example - Date Ranges:**

```typescript
import React, { useState } from 'react';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import type { DateRange } from '@spacedevin/react-mui-multi-range-picker';

function App() {
  const [ranges, setRanges] = useState<DateRange[]>([]);

  return (
    <MultiRangeDatePicker
      onChange={setRanges}
      mergeRanges={false}
    />
  );
}
```

**Individual Dates:**

```typescript
import React, { useState } from 'react';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';

function App() {
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <MultiRangeDatePicker
      onIndividualDatesChange={setDates}
    />
  );
}
```

**Both Ranges and Individual Dates:**

```typescript
import React, { useState } from 'react';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import type { DateRange } from '@spacedevin/react-mui-multi-range-picker';

function App() {
  const [ranges, setRanges] = useState<DateRange[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <MultiRangeDatePicker
      onChange={setRanges}
      onIndividualDatesChange={setDates}
      mergeRanges={false}
    />
  );
}
```

### Running Demos Locally

```bash
# Free version demo
cd packages/MuiMultiDateRangePicker
bun install
bun run dev

# Pro version demo
cd packages/MuiMultiDateRangePickerPro
bun install
bun run dev

# Root-level demos (pull from NPM)
cd examples/esm  # Vite + ESM
bun install && bun run dev

cd examples/cjs  # Webpack + CJS
bun install && bun run dev
```

**Live Demos:** [View on GitHub Pages](https://spacedevin.github.io/mui-date-dragger/)

## 📦 Package Structure

This monorepo contains two npm packages with identical APIs:

```
mui-date-dragger/
├── packages/
│   ├── MuiMultiDateRangePicker/     # Free version
│   │   ├── lib/                      # Source code
│   │   ├── dist/                     # Built ESM + CJS + types
│   │   └── examples/demo/            # Local demo app
│   └── MuiMultiDateRangePickerPro/  # Pro version
│       ├── lib/                      # Source code
│       ├── dist/                     # Built ESM + CJS + types
│       └── examples/demo/            # Local demo app
└── examples/                         # Root-level demos
    ├── esm/                          # Vite demo (pulls from NPM)
    └── cjs/                          # Webpack demo (pulls from NPM)
```

**Package Features:**
- ✅ Tree-shakeable exports (ESM + CJS)
- ✅ Full TypeScript support with declarations
- ✅ Peer dependencies (no duplicate MUI/React)
- ✅ Zero side effects for optimal bundling
- ✅ Separate demo apps (not included in published package)

## ✨ Key Features

### Multi-Range & Individual Date Selection
Select multiple separate date ranges or individual dates on a single calendar - perfect for vacation booking, availability calendars, or any scenario requiring non-contiguous date selection. Supports both range-based and individual date selection modes.

### Click & Drag Support
Intuitive drag-to-select interaction works seamlessly on both desktop (mouse) and mobile (touch) devices.

### Flexible Date Management
- **Date Ranges**: Select start and end dates for periods
- **Individual Dates**: Select specific dates without ranges
- **Dual Mode**: Track both ranges and individual dates simultaneously
- **Add ranges**: Click/drag or use text input (Pro)
- **Remove ranges**: Drag over existing ranges or use chip close buttons (Pro)
- **Auto-merge**: Optional automatic merging of adjacent/overlapping ranges

### MUI Integration
Built as extensions of MUI's date picker components, maintaining full compatibility with:
- Theme system (light/dark mode)
- Localization
- Accessibility features
- Responsive design

## 🎯 Use Cases

- **Booking Systems**: Multi-night hotel or rental reservations
- **Availability Calendars**: Mark multiple unavailable date ranges
- **Event Planning**: Select multiple event or blackout dates
- **Project Management**: Highlight multiple milestone or sprint periods
- **Time Off Requests**: Select multiple vacation periods

## 🔧 Technology Stack

- **React** 19+ with TypeScript
- **Material-UI** 7+ (`@mui/material`)
- **MUI X Date Pickers** 8+ (`@mui/x-date-pickers`)
- **MUI X Date Pickers Pro** 8+ (`@mui/x-date-pickers-pro`) - Pro version only
- **date-fns** 4+ for date manipulation
- **Emotion** for styling

## 📋 Comparison

| Feature | Free | Pro |
|---------|------|-----|
| Multi-range selection | ✅ | ✅ |
| Individual date selection | ✅ | ✅ |
| Drag to select | ✅ | ✅ |
| Calendar view | ✅ | ✅ |
| Theme support | ✅ | ✅ |
| Touch support | ✅ | ✅ |
| Auto-merge ranges | ✅ | ✅ |
| Text input field | ❌ | ✅ |
| Range chips UI | ❌ | ✅ |
| Click to delete chips | ❌ | ✅ |
| License required | ❌ Free | ⚠️ MUI X Pro |

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Commit conventions
- Release process
- Testing guidelines

## 📄 License

[PIF](https://payitforwardlicense.com/)

Note: Pro version requires MUI X Pro license for production use


## 🔗 Links

- [MUI Documentation](https://mui.com/)
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)
