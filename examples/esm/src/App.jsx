import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import { MultiRangeDatePicker as ProPicker } from '@spacedevin/react-mui-pro-multi-range-picker';

export default function App() {
  const [basicRanges, setBasicRanges] = useState([]);
  const [basicDates, setBasicDates] = useState([]);
  const [mergedRanges, setMergedRanges] = useState([]);
  const [proRanges, setProRanges] = useState([]);
  const [proDates, setProDates] = useState([]);
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  const handleThemeChange = (_event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Multi-Range Date Picker Examples
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ESM Demo - Using ES Modules from NPM
            </Typography>
          </Box>
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
          {/* Basic Free Version Example */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Free Version - Basic Usage
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Standard single calendar with range selection and deletion
            </Typography>
            <Box display="flex" justifyContent="center">
              <MultiRangeDatePicker
                onChange={setBasicRanges}
                onIndividualDatesChange={setBasicDates}
                mergeRanges={false}
                returnIndividualDates={true}
              />
            </Box>
            {basicRanges.length > 0 && (
              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Selected Ranges ({basicRanges.length}):
                </Typography>
                {basicRanges.map((range, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    • {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                  </Typography>
                ))}
                {basicDates.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Total Selected Days: {basicDates.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Individual dates: {basicDates.map(d => d.toLocaleDateString()).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          {/* Auto-Merge Example */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Free Version - Auto-Merge Adjacent Ranges
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

          {/* Pro Version */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pro Version - Chip Management
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enhanced version with chip UI for easy range viewing and deletion
            </Typography>
            <Box display="flex" justifyContent="center">
              <ProPicker
                onChange={setProRanges}
                onIndividualDatesChange={setProDates}
                returnIndividualDates={true}
              />
            </Box>
            {proRanges.length > 0 && (
              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Selected Ranges ({proRanges.length}):
                </Typography>
                {proRanges.map((range, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    • {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                  </Typography>
                ))}
                {proDates.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Total Selected Days: {proDates.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Individual dates: {proDates.map(d => d.toLocaleDateString()).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          {/* Installation */}
          <Paper elevation={2} sx={{ p: 3, bgcolor: mode === 'dark' ? 'grey.900' : 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Installation
            </Typography>
            <Box component="pre" sx={{ bgcolor: 'grey.900', color: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto', m: 0 }}>
              <code>
{`# Free Version
npm install @spacedevin/react-mui-multi-range-picker

# Pro Version
npm install @spacedevin/react-mui-pro-multi-range-picker`}
              </code>
            </Box>
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
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✓ Pro: Chip Management (Pro Version)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visual chips with delete buttons for easy range management
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
