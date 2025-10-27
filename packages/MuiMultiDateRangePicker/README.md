# MUI Multi-Range Date Picker

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
npm install @mui/material @mui/x-date-pickers @emotion/react @emotion/styled date-fns
```

## Dependencies

This component requires the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@mui/material` >= 5.0.0
- `@mui/x-date-pickers` >= 6.0.0
- `@emotion/react` >= 11.0.0
- `@emotion/styled` >= 11.0.0
- `date-fns` >= 2.0.0

## Basic Usage

```tsx
import React, { useState } from 'react';
import MultiRangeDatePicker from './components/MultiRangeDatePicker';

interface DateRange {
  start: Date;
  end: Date;
}

function App() {
  const [selectedRanges, setSelectedRanges] = useState<DateRange[]>([]);

  const handleRangeChange = (ranges: DateRange[]) => {
    console.log('Selected ranges:', ranges);
    setSelectedRanges(ranges);
  };

  return (
    <div>
      <MultiRangeDatePicker onChange={handleRangeChange} />
      
      {/* Display selected ranges */}
      {selectedRanges.map((range, index) => (
        <div key={index}>
          {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}
```

## Props

### `MultiRangeDatePickerProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(ranges: DateRange[]) => void` | `undefined` | Callback fired when the selected ranges change |
| `onIndividualDatesChange` | `(dates: Date[]) => void` | `undefined` | Callback fired with all selected dates as individual Date objects |
| `mergeRanges` | `boolean` | `false` | When `true`, adjacent or overlapping ranges are automatically merged |
| `returnIndividualDates` | `boolean` | `false` | When `true`, triggers `onIndividualDatesChange` callback |

### `DateRange` Interface

```tsx
interface DateRange {
  start: Date;  // Start date of the range (inclusive)
  end: Date;    // End date of the range (inclusive)
}
```

## Advanced Examples

### Auto-Merge Adjacent Ranges

Automatically merge adjacent or overlapping date ranges:

```tsx
<MultiRangeDatePicker 
  onChange={handleRangeChange}
  mergeRanges={true}
/>
```

### Get Individual Dates

Receive all selected dates as a flat array:

```tsx
const [individualDates, setIndividualDates] = useState<Date[]>([]);

<MultiRangeDatePicker 
  onChange={handleRangeChange}
  onIndividualDatesChange={setIndividualDates}
  returnIndividualDates={true}
/>

console.log(`Total selected days: ${individualDates.length}`);
```

### With Theme Integration

```tsx
import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <MultiRangeDatePicker onChange={handleRangeChange} />
    </ThemeProvider>
  );
}
```

## MUI Component Compatibility

This component is built as an extension of MUI's `DateCalendar` component and maintains compatibility with MUI's theming system:

### Similar to MUI DateCalendar
- Uses `LocalizationProvider` for date formatting
- Supports `AdapterDateFns` and other MUI date adapters
- Respects MUI theme palette colors
- Works with `ThemeProvider` for light/dark mode

### Key Differences
- **Multi-range selection** instead of single date
- **Drag interaction** for range selection
- **Custom props** for range management (`onChange`, `mergeRanges`, etc.)
- Returns `DateRange[]` instead of single `Date`

### Migration from MUI DateCalendar

If you're currently using `DateCalendar`:

```tsx
// Before (MUI DateCalendar)
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar 
  value={selectedDate}
  onChange={(newValue) => setSelectedDate(newValue)}
/>

// After (MultiRangeDatePicker)
import MultiRangeDatePicker from './components/MultiRangeDatePicker';

<MultiRangeDatePicker 
  onChange={(ranges) => setSelectedRanges(ranges)}
/>
```

## How It Works

1. **Click and drag** across dates to select a range
2. **Release** to confirm the selection
3. **Click/drag over existing ranges** to delete them
4. **Select multiple ranges** by repeating the process

The component uses pointer events for cross-platform support (mouse and touch), making it work seamlessly on desktop and mobile devices.

## Styling

The component uses MUI's `sx` prop system and respects your theme's primary color:

```tsx
// The component automatically uses your theme's primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Selected ranges will use this color
    },
  },
});
```

## Browser Support

- Modern browsers with Pointer Events API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Related Components

For a version with MUI Pro features (built-in date range picker UI with text input), see [@mui-multi-date-range-picker-pro](../MuiMultiDateRangePickerPro).
