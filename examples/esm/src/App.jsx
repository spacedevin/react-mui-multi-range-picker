import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import { MultiRangeDatePicker as ProPicker } from '@spacedevin/react-mui-pro-multi-range-picker';

export default function App() {
  const [freeRanges, setFreeRanges] = useState([]);
  const [proRanges, setProRanges] = useState([]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          ESM Demo
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Using ES Modules (import/export)
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Free Version
          </Typography>
          <Paper sx={{ p: 3 }}>
            <MultiRangeDatePicker
              value={freeRanges}
              onChange={setFreeRanges}
            />
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Selected: {freeRanges.length} ranges
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Pro Version
          </Typography>
          <Paper sx={{ p: 3 }}>
            <ProPicker
              value={proRanges}
              onChange={setProRanges}
            />
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Selected: {proRanges.length} ranges
            </Typography>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

