# @spacedevin/react-mui-pro-multi-range-picker

A React date picker component that allows selecting multiple non-contiguous date ranges with click-and-drag support. Built on top of Material-UI's `@mui/x-date-pickers-pro` with text input field and chip-based range management.

## Features

- ✅ **Multi-Range Selection**: Select multiple separate date ranges
- ✅ **Pro UI**: Built-in text input field and visual range chips
- ✅ **Click & Drag**: Intuitive drag-to-select interaction
- ✅ **Range Management**: Delete ranges via chip close buttons
- ✅ **Auto-Merge**: Optional automatic merging of adjacent/overlapping ranges
- ✅ **Flexible Output**: Get results as date ranges or individual dates
- ✅ **MUI Theme Integration**: Full compatibility with Material-UI themes
- ✅ **Touch Support**: Works on desktop and mobile devices

## Installation

```bash
npm install @spacedevin/react-mui-pro-multi-range-picker
```

### Peer Dependencies

```bash
npm install @mui/material @mui/x-date-pickers @mui/x-date-pickers-pro @emotion/react @emotion/styled date-fns react react-dom
```

⚠️ **Note**: This component requires `@mui/x-date-pickers-pro`, which is a commercial library requiring a license for production use. Learn more at [MUI X Pricing](https://mui.com/x/introduction/licensing/).

## Quick Start

```tsx
import { MultiRangeDatePicker } from '@spacedevin/react-mui-pro-multi-range-picker';
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
| `returnIndividualDates` | `boolean` | `false` | When `true`, triggers `onIndividualDatesChange` callback |

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
  returnIndividualDates={true}
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

## UI Components

### Range Chips
Selected ranges are displayed as chips with delete buttons:
- Format: "MM/DD/YYYY - MM/DD/YYYY"
- Click X button to remove a range

### Calendar View
Full calendar with visual range highlighting and drag-to-select functionality.

## How It Works

### Selection Methods
1. **Drag Selection**: Click and drag across dates for quick range selection
2. **Click/Drag Over Range**: Remove existing ranges

### Range Management
- **Add Range**: Complete a selection via calendar
- **Delete Range**: Click the X button on any chip
- **Merge Ranges**: Enable `mergeRanges` prop for auto-merging

## TypeScript

```tsx
import type { DateRange } from '@spacedevin/react-mui-pro-multi-range-picker';

interface DateRange {
  start: Date;  // Start date of the range (inclusive)
  end: Date;    // End date of the range (inclusive)
}
```

## Browser Support

- Modern browsers with Pointer Events API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Comparison: Free vs Pro

| Feature | Free Version | Pro Version |
|---------|-------------|-------------|
| Multi-range selection | ✅ | ✅ |
| Drag to select | ✅ | ✅ |
| MUI theme support | ✅ | ✅ |
| Text input field | ❌ | ✅ |
| Range chips UI | ❌ | ✅ |
| Click to delete chips | ❌ | ✅ |
| License required | ❌ | ⚠️ MUI X Pro |

## License

PIF (Note: Requires MUI X Pro license for `@mui/x-date-pickers-pro`)

## Related

For a free version without Pro UI features, see [@spacedevin/react-mui-multi-range-picker](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker).
