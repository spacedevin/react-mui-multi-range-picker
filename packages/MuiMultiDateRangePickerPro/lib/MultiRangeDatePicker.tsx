import React, { useState, useCallback, useRef } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Box, Chip, Stack, Paper } from '@mui/material';
import { DateRange as MUIDateRange } from '@mui/x-date-pickers-pro/models';
import { isSameDay, isWithinInterval, startOfDay, isValid } from 'date-fns';
import type { DateRange, MultiRangeDatePickerProps } from './types';

const MultiRangeDatePicker: React.FC<MultiRangeDatePickerProps> = ({ 
  onChange, 
  onIndividualDatesChange,
  mergeRanges = false,
  returnIndividualDates = false 
}) => {
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [currentRange, setCurrentRange] = useState<MUIDateRange<Date>>([null, null]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const dragEndRef = useRef<Date | null>(null);
  const dateButtonsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [, forceUpdate] = useState({});

  const isDateInRange = useCallback(
    (date: Date) => {
      if (!date || !isValid(date)) return false;
      return dateRanges.some((range) => {
        try {
          if (!isValid(range.start) || !isValid(range.end)) return false;
          return isWithinInterval(startOfDay(date), {
            start: startOfDay(range.start),
            end: startOfDay(range.end),
          });
        } catch {
          return false;
        }
      });
    },
    [dateRanges]
  );

  const isDateInCurrentRange = useCallback(
    (date: Date) => {
      if (!date || !isValid(date)) return false;
      
      // Check picker's current range
      const [start, end] = currentRange;
      if (start && end && isValid(start) && isValid(end)) {
        try {
          const inPickerRange = isWithinInterval(startOfDay(date), {
            start: startOfDay(start < end ? start : end),
            end: startOfDay(start < end ? end : start),
          });
          if (inPickerRange) return true;
        } catch {}
      }
      
      // Check drag selection
      const dragStart = dragStartRef.current;
      const dragEnd = dragEndRef.current;
      if (isDraggingRef.current && dragStart && dragEnd && isValid(dragStart) && isValid(dragEnd)) {
        try {
          return isWithinInterval(startOfDay(date), {
            start: startOfDay(dragStart < dragEnd ? dragStart : dragEnd),
            end: startOfDay(dragStart < dragEnd ? dragEnd : dragStart),
          });
        } catch {}
      }
      
      return false;
    },
    [currentRange]
  );

  const hasAdjacentSelectedDate = useCallback(
    (date: Date, direction: 'left' | 'right') => {
      if (!date || !isValid(date)) return false;
      const adjacentDate = new Date(date);
      adjacentDate.setDate(adjacentDate.getDate() + (direction === 'right' ? 1 : -1));
      return isDateInRange(adjacentDate) || isDateInCurrentRange(adjacentDate);
    },
    [isDateInRange, isDateInCurrentRange]
  );

  const mergeOverlappingRanges = useCallback((ranges: DateRange[]): DateRange[] => {
    if (ranges.length <= 1) return ranges;
    
    const sorted = [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());
    const merged: DateRange[] = [];
    let current = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      const currentEnd = new Date(current.end);
      currentEnd.setDate(currentEnd.getDate() + 1);
      
      if (next.start <= currentEnd) {
        current = {
          start: current.start,
          end: next.end > current.end ? next.end : current.end,
        };
      } else {
        merged.push(current);
        current = next;
      }
    }
    merged.push(current);
    
    return merged;
  }, []);

  const getRangesAsIndividualDates = useCallback((ranges: DateRange[]): Date[] => {
    const dates: Date[] = [];
    ranges.forEach((range) => {
      const current = new Date(range.start);
      while (current <= range.end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }, []);

  const commitDragSelection = useCallback(() => {
    const dragStart = dragStartRef.current;
    const dragEnd = dragEndRef.current;
    
    if (!dragStart || !dragEnd || !isValid(dragStart) || !isValid(dragEnd)) {
      return;
    }

    const normalizedStart = dragStart < dragEnd ? dragStart : dragEnd;
    const normalizedEnd = dragStart < dragEnd ? dragEnd : dragStart;

    const overlappingIndices: number[] = [];
    dateRanges.forEach((range, index) => {
      try {
        const rangeStart = startOfDay(range.start);
        const rangeEnd = startOfDay(range.end);
        const selectionStart = startOfDay(normalizedStart);
        const selectionEnd = startOfDay(normalizedEnd);

        const hasOverlap = 
          isWithinInterval(selectionStart, { start: rangeStart, end: rangeEnd }) ||
          isWithinInterval(selectionEnd, { start: rangeStart, end: rangeEnd }) ||
          isWithinInterval(rangeStart, { start: selectionStart, end: selectionEnd }) ||
          isWithinInterval(rangeEnd, { start: selectionStart, end: selectionEnd });

        if (hasOverlap) {
          overlappingIndices.push(index);
        }
      } catch {}
    });

    let updatedRanges: DateRange[];
    
    if (overlappingIndices.length > 0) {
      updatedRanges = dateRanges.filter((_, index) => !overlappingIndices.includes(index));
    } else {
      const newRange: DateRange = {
        start: startOfDay(normalizedStart),
        end: startOfDay(normalizedEnd),
      };
      updatedRanges = [...dateRanges, newRange];
    }

    if (mergeRanges) {
      updatedRanges = mergeOverlappingRanges(updatedRanges);
    }

    setDateRanges(updatedRanges);
    
    if (onChange) {
      onChange(updatedRanges);
    }
    
    if (onIndividualDatesChange || returnIndividualDates) {
      const individualDates = getRangesAsIndividualDates(updatedRanges);
      if (onIndividualDatesChange) {
        onIndividualDatesChange(individualDates);
      }
    }
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates, mergeRanges, mergeOverlappingRanges, getRangesAsIndividualDates]);

  const handleRangeChange = useCallback((newValue: MUIDateRange<Date>) => {
    // Only update if not dragging (to avoid interference)
    if (!isDraggingRef.current) {
      setCurrentRange(newValue);
      
      // If both start and end are selected, commit the range from picker
      if (newValue[0] && newValue[1]) {
        setTimeout(() => {
          const [start, end] = newValue;
          if (!start || !end) return;
          
          const normalizedStart = start < end ? start : end;
          const normalizedEnd = start < end ? end : start;
          
          const overlappingIndices: number[] = [];
          dateRanges.forEach((range, index) => {
            try {
              const rangeStart = startOfDay(range.start);
              const rangeEnd = startOfDay(range.end);
              const selectionStart = startOfDay(normalizedStart);
              const selectionEnd = startOfDay(normalizedEnd);

              const hasOverlap = 
                isWithinInterval(selectionStart, { start: rangeStart, end: rangeEnd }) ||
                isWithinInterval(selectionEnd, { start: rangeStart, end: rangeEnd }) ||
                isWithinInterval(rangeStart, { start: selectionStart, end: selectionEnd }) ||
                isWithinInterval(rangeEnd, { start: selectionStart, end: selectionEnd });

              if (hasOverlap) {
                overlappingIndices.push(index);
              }
            } catch {}
          });

          let updatedRanges: DateRange[];
          
          if (overlappingIndices.length > 0) {
            updatedRanges = dateRanges.filter((_, index) => !overlappingIndices.includes(index));
          } else {
            const newRange: DateRange = {
              start: startOfDay(normalizedStart),
              end: startOfDay(normalizedEnd),
            };
            updatedRanges = [...dateRanges, newRange];
          }

          if (mergeRanges) {
            updatedRanges = mergeOverlappingRanges(updatedRanges);
          }

          setDateRanges(updatedRanges);
          setCurrentRange([null, null]);
          
          if (onChange) {
            onChange(updatedRanges);
          }
          
          if (onIndividualDatesChange || returnIndividualDates) {
            const individualDates = getRangesAsIndividualDates(updatedRanges);
            if (onIndividualDatesChange) {
              onIndividualDatesChange(individualDates);
            }
          }
        }, 0);
      }
    }
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates, mergeRanges, mergeOverlappingRanges, getRangesAsIndividualDates]);

  const handlePointerDown = useCallback((date: Date, e: React.PointerEvent) => {
    if (!date || !isValid(date)) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDraggingRef.current = true;
    dragStartRef.current = date;
    dragEndRef.current = date;
    
    const target = e.target as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
    forceUpdate({});
  }, []);

  const handlePointerMove = useCallback((date: Date) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    if (!date || !isValid(date)) return;
    
    if (!dragEndRef.current || !isSameDay(date, dragEndRef.current)) {
      dragEndRef.current = date;
      forceUpdate({});
    }
  }, []);

  const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;
    
    // Find which date button is under the pointer
    dateButtonsRef.current.forEach((button, dateStr) => {
      if (button === element || button.contains(element)) {
        const date = new Date(dateStr);
        if (isValid(date)) {
          handlePointerMove(date);
        }
      }
    });
  }, [handlePointerMove]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    commitDragSelection();
    
    isDraggingRef.current = false;
    dragStartRef.current = null;
    dragEndRef.current = null;
    forceUpdate({});
  }, [commitDragSelection]);

  const handleRemoveRange = useCallback((index: number) => {
    const updatedRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedRanges);
    
    if (onChange) {
      onChange(updatedRanges);
    }
    
    if (onIndividualDatesChange || returnIndividualDates) {
      const individualDates = getRangesAsIndividualDates(updatedRanges);
      if (onIndividualDatesChange) {
        onIndividualDatesChange(individualDates);
      }
    }
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates, getRangesAsIndividualDates]);

  const CustomDay = useCallback(
    (props: PickersDayProps) => {
      const { day, ...other } = props;
      
      if (!day || !isValid(day)) {
        return <PickersDay day={day} {...other} />;
      }

      const isInSavedRange = isDateInRange(day);
      const isInCurrent = isDateInCurrentRange(day);
      const isSelected = isInSavedRange || isInCurrent;

      // Check adjacent dates
      const hasLeftSelected = hasAdjacentSelectedDate(day, 'left');
      const hasRightSelected = hasAdjacentSelectedDate(day, 'right');
      
      const shouldRoundLeft = isSelected && !hasLeftSelected;
      const shouldRoundRight = isSelected && !hasRightSelected;

      return (
        <Box
          component="span"
          ref={(el: HTMLElement | null) => {
            if (el) {
              dateButtonsRef.current.set(day.toISOString(), el);
            }
          }}
          onPointerDown={(e) => handlePointerDown(day, e)}
          sx={{
            display: 'inline-block',
            position: 'relative',
          }}
        >
          <PickersDay
            {...other}
            day={day}
            sx={{
              backgroundColor: isSelected ? 'primary.main' : undefined,
              color: isSelected ? 'primary.contrastText' : undefined,
              transition: 'none',
              '&:hover': {
                backgroundColor: isSelected ? 'primary.dark' : undefined,
              },
              borderRadius: '50%',
              ...(isSelected && !shouldRoundLeft && !shouldRoundRight && {
                borderRadius: 0,
              }),
              ...(shouldRoundLeft && !shouldRoundRight && {
                borderRadius: '50% 0 0 50%',
              }),
              ...(shouldRoundRight && !shouldRoundLeft && {
                borderRadius: '0 50% 50% 0',
              }),
              position: 'relative',
              touchAction: 'none',
              userSelect: 'none',
              // Fill gaps for range continuity
              ...(!shouldRoundLeft && isSelected && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -2,
                  top: 0,
                  width: 2,
                  height: '100%',
                  backgroundColor: 'primary.main',
                },
              }),
              ...(!shouldRoundRight && isSelected && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -2,
                  top: 0,
                  width: 2,
                  height: '100%',
                  backgroundColor: 'primary.main',
                },
              }),
            }}
          />
        </Box>
      );
    },
    [isDateInRange, isDateInCurrentRange, hasAdjacentSelectedDate, handlePointerDown]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        {/* Display saved ranges */}
        {dateRanges.length > 0 && (
          <Paper elevation={1} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {dateRanges.map((range, index) => (
                <Chip
                  key={index}
                  label={`${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`}
                  onDelete={() => handleRemoveRange(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Paper>
        )}
        
        {/* DateRangePicker for selecting new ranges */}
        <Box
          onPointerMove={handleContainerPointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          sx={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
        >
          <DateRangePicker
            value={currentRange}
            onChange={handleRangeChange}
            slots={{
              field: SingleInputDateRangeField,
              day: CustomDay,
            }}
            slotProps={{
              textField: {
                placeholder: 'Select date range',
                fullWidth: true,
              },
            }}
          />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export default MultiRangeDatePicker;
