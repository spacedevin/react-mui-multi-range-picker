# @spacedevin/react-mui-multi-range-picker

A React date picker component that allows selecting multiple non-contiguous date ranges with click-and-drag support. Built on top of Material-UI's `@mui/x-date-pickers` with full theme integration.

## Features

- ✅ **Multi-Range Selection**: Select multiple separate date ranges on a single calendar
- ✅ **Click & Drag**: Intuitive drag-to-select interaction (works on desktop and mobile)
- ✅ **Range Deletion**: Click or drag over existing ranges to remove them
- ✅ **Auto-Merge**: Optional automatic merging of adjacent/overlapping ranges
- ✅ **Flexible Output**: Get results as date ranges or individual dates
- ✅ **MUI Theme Integration**: Full compatibility with Material-UI themes (light/dark mode)
- ✅ **Touch Support**: Works seamlessly on touch devices

## Installation

```bash
npm install @spacedevin/react-mui-multi-range-picker
```

### Peer Dependencies

```bash
npm install @mui/material @mui/x-date-pickers @emotion/react @emotion/styled date-fns react react-dom
```

## Quick Start

```tsx
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import { useState } from 'react';

interface DateRange {
  start: Date;
  end: Date;
}

function App() {
  const [ranges, setRanges] = useState<DateRange[]>([]);

  return (
    <MultiRangeDatePicker onChange={setRanges} />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(ranges: DateRange[]) => void` | `undefined` | Callback fired when the selected ranges change |
| `onIndividualDatesChange` | `(dates: Date[]) => void` | `undefined` | Callback fired with all selected dates as individual Date objects |
| `mergeRanges` | `boolean` | `false` | When `true`, adjacent or overlapping ranges are automatically merged |

## Examples

### Auto-Merge Adjacent Ranges

```tsx
<MultiRangeDatePicker 
  onChange={setRanges}
  mergeRanges={true}
/>
```

### Get Individual Dates

```tsx
const [dates, setDates] = useState<Date[]>([]);

<MultiRangeDatePicker 
  onChange={setRanges}
  onIndividualDatesChange={setDates}
/>

console.log(`Total days: ${dates.length}`);
```

### Dark Mode

```tsx
import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

<ThemeProvider theme={darkTheme}>
  <MultiRangeDatePicker onChange={setRanges} />
</ThemeProvider>
```

## How It Works

1. **Click and drag** across dates to select a range
2. **Release** to confirm the selection
3. **Click/drag over existing ranges** to delete them
4. **Select multiple ranges** by repeating the process

## TypeScript

```tsx
import type { DateRange } from '@spacedevin/react-mui-multi-range-picker';

interface DateRange {
  start: Date;  // Start date of the range (inclusive)
  end: Date;    // End date of the range (inclusive)
}
```

## Browser Support

- Modern browsers with Pointer Events API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

PIF

## Related

For a version with chip management UI, see [@spacedevin/react-mui-pro-multi-range-picker](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker).
