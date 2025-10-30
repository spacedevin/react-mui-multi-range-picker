import React, { useState, useMemo } from 'react';
import './App.css';
import { MultiRangeDatePicker } from './lib';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { 
  LightMode as LightModeIcon, 
  DarkMode as DarkModeIcon 
} from '@mui/icons-material';

interface DateRange {
  start: Date;
  end: Date;
}

type ThemeMode = 'light' | 'dark';

function App() {
  const [selectedRanges, setSelectedRanges] = useState<DateRange[]>([]);
  const [individualDates, setIndividualDates] = useState<Date[]>([]);
  const [mergedRanges, setMergedRanges] = useState<DateRange[]>([]);
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  const handleRangeChange = (ranges: DateRange[]) => {
    setSelectedRanges(ranges);
  };

  const handleIndividualDatesChange = (dates: Date[]) => {
    setIndividualDates(dates);
  };

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newMode: ThemeMode | null) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Multi-Range Date Picker Examples
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleThemeChange}
            aria-label="theme mode"
            size="small"
          >
            <ToggleButton value="light" aria-label="light mode">
              <LightModeIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="dark" aria-label="dark mode">
              <DarkModeIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="body1" gutterBottom color="text.secondary" mb={4}>
          Click and drag to select multiple date ranges. Click existing ranges to delete them.
          Works on desktop and mobile devices.
        </Typography>

        <Stack spacing={4}>
          {/* Basic Example */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Usage
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Standard single calendar with range selection and deletion
            </Typography>
            <Box display="flex" justifyContent="center">
              <MultiRangeDatePicker 
                onChange={handleRangeChange}
                onIndividualDatesChange={handleIndividualDatesChange}
                mergeRanges={false}
              />
            </Box>
            {selectedRanges.length > 0 && (
              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Selected Ranges ({selectedRanges.length}):
                </Typography>
                {selectedRanges.map((range, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    • {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                  </Typography>
                ))}
                {individualDates.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Total Selected Days: {individualDates.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Individual dates: {individualDates.map(d => d.toLocaleDateString()).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          {/* Merged Ranges Example */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Auto-Merge Adjacent Ranges
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Adjacent date ranges are automatically merged into a single continuous range
            </Typography>
            <Box display="flex" justifyContent="center">
              <MultiRangeDatePicker 
                mergeRanges={true}
                onChange={setMergedRanges}
              />
            </Box>
            {mergedRanges.length > 0 && (
              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Merged Ranges ({mergedRanges.length}):
                </Typography>
                {mergedRanges.map((range, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    • {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>

          {/* Feature Showcase */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Features
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Multi-Range Selection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select multiple non-contiguous date ranges on the same calendar
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Click & Drag Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Works seamlessly with both mouse (desktop) and touch (mobile/tablet)
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Range Deletion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click or drag over existing ranges to delete them
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Auto-Merge Option
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Optionally merge adjacent or overlapping ranges automatically
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ MUI Theme Integration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fully compatible with Material-UI themes, including dark mode
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Flexible Output
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get results as date ranges or individual dates array
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
