# MUI Multi-Range Date Picker Pro

A React date picker component that allows selecting multiple non-contiguous date ranges with click-and-drag support. Built on top of Material-UI's `@mui/x-date-pickers-pro` with a professional UI including text input field and chip-based range management.

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
npm install @mui/material @mui/x-date-pickers @mui/x-date-pickers-pro @emotion/react @emotion/styled date-fns
```

⚠️ **Note**: This component requires `@mui/x-date-pickers-pro`, which is a commercial library requiring a license for production use.

## Dependencies

This component requires the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@mui/material` >= 5.0.0
- `@mui/x-date-pickers` >= 6.0.0
- `@mui/x-date-pickers-pro` >= 6.0.0 (requires license)
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
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MultiRangeDatePicker onChange={handleRangeChange} />
    </ThemeProvider>
  );
}
```

## UI Components

### Date Range Input Field
The component includes a text input field (using `SingleInputDateRangeField`) for manual date entry and range selection.

### Range Chips
Selected ranges are displayed as chips with delete buttons for easy management:

```tsx
// Ranges are automatically displayed as chips
// Click the X button to remove a range
// Format: "MM/DD/YYYY - MM/DD/YYYY"
```

### Calendar View
Full calendar with visual range highlighting and drag-to-select functionality.

## MUI Component Compatibility

This component is built as an extension of MUI Pro's `DateRangePicker` and maintains compatibility with MUI's theming system:

### Similar to MUI DateRangePicker
- Uses `LocalizationProvider` for date formatting
- Supports `AdapterDateFns` and other MUI date adapters
- Includes text input field via `SingleInputDateRangeField`
- Uses MUI's `PickersDay` component for calendar days
- Respects MUI theme palette colors
- Works with `ThemeProvider` for light/dark mode

### Key Differences
- **Multi-range selection** instead of single range
- **Drag interaction** on calendar for quick selection
- **Chip-based UI** for managing multiple ranges
- **Custom props** for range management (`mergeRanges`, etc.)
- Returns `DateRange[]` array instead of single range

### Migration from MUI DateRangePicker

If you're currently using `DateRangePicker`:

```tsx
// Before (MUI DateRangePicker)
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

<DateRangePicker 
  value={dateRange}
  onChange={(newValue) => setDateRange(newValue)}
/>

// After (MultiRangeDatePicker)
import MultiRangeDatePicker from './components/MultiRangeDatePicker';

<MultiRangeDatePicker 
  onChange={(ranges) => setSelectedRanges(ranges)}
/>
```

**Key Migration Notes:**
- Change `value` to `onChange` callback pattern
- Single range `[Date, Date]` becomes array of ranges `DateRange[]`
- Add range management logic to handle multiple ranges
- Text input now creates ranges that persist as chips

## How It Works

### Multiple Selection Methods

1. **Text Input**: Type dates in the input field
2. **Click Calendar Dates**: Click start and end dates in calendar
3. **Drag Selection**: Click and drag across dates for quick range selection

### Range Management

- **Add Range**: Complete a selection via input or calendar
- **Delete Range**: Click the X button on any chip
- **Override Range**: Drag over existing range to remove it
- **Merge Ranges**: Enable `mergeRanges` prop for auto-merging

## Styling

The component uses MUI's `sx` prop system and respects your theme:

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Selected ranges and chips use this color
    },
  },
});
```

### Component Structure

```tsx
<LocalizationProvider>
  <Stack spacing={2}>
    {/* Chips showing selected ranges */}
    <Paper>
      <Stack direction="row">
        <Chip label="Date Range 1" onDelete={...} />
        <Chip label="Date Range 2" onDelete={...} />
      </Stack>
    </Paper>
    
    {/* DateRangePicker with custom day rendering */}
    <DateRangePicker
      slots={{ field: SingleInputDateRangeField, day: CustomDay }}
    />
  </Stack>
</LocalizationProvider>
```

## License Requirements

⚠️ **Important**: This component uses `@mui/x-date-pickers-pro`, which requires a commercial license for production use.

- **Free**: Development and evaluation
- **Commercial**: Requires MUI X Pro or Premium license
- Learn more: [MUI X Pricing](https://mui.com/x/introduction/licensing/)

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

## Related Components

For a free version without Pro UI features, see [@mui-multi-date-range-picker](../MuiMultiDateRangePicker).

## License

MIT (Note: Requires MUI X Pro license for production use)
