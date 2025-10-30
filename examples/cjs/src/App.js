const React = require('react');
const {
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
} = require('@mui/material');
const {
  LightMode: LightModeIcon,
  DarkMode: DarkModeIcon
} = require('@mui/icons-material');
const { MultiRangeDatePicker } = require('@spacedevin/react-mui-multi-range-picker');
const { MultiRangeDatePicker: ProPicker } = require('@spacedevin/react-mui-pro-multi-range-picker');

function App() {
  const [freeRanges, setFreeRanges] = React.useState([]);
  const [freeDates, setFreeDates] = React.useState([]);
  const [mergedRanges, setMergedRanges] = React.useState([]);
  const [proRanges, setProRanges] = React.useState([]);
  const [proDates, setProDates] = React.useState([]);
  const [mode, setMode] = React.useState('light');

  const theme = React.useMemo(
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

  return React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(CssBaseline),
    React.createElement(
      Container,
      { maxWidth: 'xl', sx: { py: 4 } },
      React.createElement(
        Box,
        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 },
        React.createElement(
          Box,
          null,
          React.createElement(Typography, { variant: 'h4', component: 'h1', gutterBottom: true }, 'MUI Multi-Range Date Picker'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'CJS Demo - Using CommonJS from NPM')
        ),
        React.createElement(
          ToggleButtonGroup,
          {
            value: mode,
            exclusive: true,
            onChange: handleThemeChange,
            'aria-label': 'theme mode',
            size: 'small'
          },
          React.createElement(
            ToggleButton,
            { value: 'light', 'aria-label': 'light mode' },
            React.createElement(LightModeIcon, { fontSize: 'small' })
          ),
          React.createElement(
            ToggleButton,
            { value: 'dark', 'aria-label': 'dark mode' },
            React.createElement(DarkModeIcon, { fontSize: 'small' })
          )
        )
      ),
      React.createElement(Typography, { variant: 'body1', gutterBottom: true, color: 'text.secondary', mb: 4 }, 
        'Click and drag to select multiple date ranges. Click existing ranges to delete them. Works on desktop and mobile devices.'
      ),
      React.createElement(
        Stack,
        { spacing: 4 },
        // Free Version - Basic
        React.createElement(
          Paper,
          { elevation: 2, sx: { p: 3 } },
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, 'Free Version - Basic Usage'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary', mb: 3 }, 
            'Standard single calendar with range selection and deletion'
          ),
          React.createElement(
            Box,
            { display: 'flex', justifyContent: 'center' },
            React.createElement(MultiRangeDatePicker, {
              onChange: setFreeRanges,
              onIndividualDatesChange: setFreeDates
            })
          ),
          freeRanges.length > 0 && React.createElement(
            Box,
            { mt: 3 },
            React.createElement(Divider, { sx: { mb: 2 } }),
            React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, `Selected Ranges (${freeRanges.length}):`),
            ...freeRanges.map((range, index) =>
              React.createElement(Typography, { key: index, variant: 'body2', color: 'text.secondary', sx: { ml: 2 } }, 
                `• ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`
              )
            ),
            freeDates.length > 0 && React.createElement(
              Box,
              { mt: 2 },
              React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, `Total Selected Days: ${freeDates.length}`),
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { ml: 2 } }, 
                `Individual dates: ${freeDates.map(d => d.toLocaleDateString()).join(', ')}`
              )
            )
          )
        ),
        // Free Version - Auto-Merge
        React.createElement(
          Paper,
          { elevation: 2, sx: { p: 3 } },
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, 'Free Version - Auto-Merge Adjacent Ranges'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary', mb: 3 }, 
            'Adjacent date ranges are automatically merged into a single continuous range'
          ),
          React.createElement(
            Box,
            { display: 'flex', justifyContent: 'center' },
            React.createElement(MultiRangeDatePicker, {
              mergeRanges: true,
              onChange: setMergedRanges
            })
          ),
          mergedRanges.length > 0 && React.createElement(
            Box,
            { mt: 3 },
            React.createElement(Divider, { sx: { mb: 2 } }),
            React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, `Merged Ranges (${mergedRanges.length}):`),
            ...mergedRanges.map((range, index) =>
              React.createElement(Typography, { key: index, variant: 'body2', color: 'text.secondary', sx: { ml: 2 } }, 
                `• ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`
              )
            )
          )
        ),
        // Pro Version - Chip Management
        React.createElement(
          Paper,
          { elevation: 2, sx: { p: 3 } },
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, 'Pro Version - Chip Management'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary', mb: 3 }, 
            'Enhanced version with chip UI for easy range viewing and deletion'
          ),
          React.createElement(
            Box,
            { display: 'flex', justifyContent: 'center' },
            React.createElement(ProPicker, {
              onChange: setProRanges,
              onIndividualDatesChange: setProDates
            })
          ),
          proDates.length > 0 && React.createElement(
            Box,
            { mt: 3 },
            React.createElement(Divider, { sx: { mb: 2 } }),
            React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, `Selected Ranges (${proRanges.length}):`),
            ...proRanges.map((range, index) =>
              React.createElement(Typography, { key: index, variant: 'body2', color: 'text.secondary', sx: { ml: 2 } }, 
                `• ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`
              )
            ),
            React.createElement(
              Box,
              { mt: 2 },
              React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, `Total Selected Days: ${proDates.length}`),
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { ml: 2 } }, 
                `Individual dates: ${proDates.map(d => d.toLocaleDateString()).join(', ')}`
              )
            )
          )
        ),
        // Installation
        React.createElement(
          Paper,
          { elevation: 2, sx: { p: 3, bgcolor: mode === 'dark' ? 'grey.900' : 'grey.50' } },
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, 'Installation'),
          React.createElement(
            Box,
            { component: 'pre', sx: { bgcolor: 'grey.900', color: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' } },
            React.createElement('code', null,
`# Free Version
npm install @spacedevin/react-mui-multi-range-picker

# Pro Version
npm install @spacedevin/react-mui-pro-multi-range-picker`
            )
          )
        )
      )
    )
  );
}

module.exports = App;
