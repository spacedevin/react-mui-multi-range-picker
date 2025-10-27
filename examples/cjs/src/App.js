const React = require('react');
const { LocalizationProvider } = require('@mui/x-date-pickers');
const { AdapterDateFns } = require('@mui/x-date-pickers/AdapterDateFns');
const { Container, Typography, Paper, Box, Divider } = require('@mui/material');
const { MultiRangeDatePicker } = require('@spacedevin/react-mui-multi-range-picker');
const { MultiRangeDatePicker: ProPicker } = require('@spacedevin/react-mui-pro-multi-range-picker');

function App() {
  const [freeRanges, setFreeRanges] = React.useState([]);
  const [proRanges, setProRanges] = React.useState([]);

  return React.createElement(
    LocalizationProvider,
    { dateAdapter: AdapterDateFns },
    React.createElement(
      Container,
      { maxWidth: 'lg', sx: { py: 4 } },
      React.createElement(Typography, { variant: 'h3', gutterBottom: true }, 'CJS Demo'),
      React.createElement(Typography, { variant: 'body2', color: 'text.secondary', paragraph: true }, 'Using CommonJS (require)'),
      React.createElement(Divider, { sx: { my: 3 } }),
      React.createElement(
        Box,
        { sx: { mb: 4 } },
        React.createElement(Typography, { variant: 'h5', gutterBottom: true }, 'Free Version'),
        React.createElement(
          Paper,
          { sx: { p: 3 } },
          React.createElement(MultiRangeDatePicker, {
            value: freeRanges,
            onChange: setFreeRanges,
          }),
          React.createElement(Typography, { variant: 'caption', sx: { mt: 2, display: 'block' } }, `Selected: ${freeRanges.length} ranges`)
        )
      ),
      React.createElement(
        Box,
        null,
        React.createElement(Typography, { variant: 'h5', gutterBottom: true }, 'Pro Version'),
        React.createElement(
          Paper,
          { sx: { p: 3 } },
          React.createElement(ProPicker, {
            value: proRanges,
            onChange: setProRanges,
          }),
          React.createElement(Typography, { variant: 'caption', sx: { mt: 2, display: 'block' } }, `Selected: ${proRanges.length} ranges`)
        )
      )
    )
  );
}

module.exports = App;

