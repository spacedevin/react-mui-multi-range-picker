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

// Pure utility functions for unit testing
export const mergeOverlappingRanges = (ranges: DateRange[]): DateRange[] => {
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
};

export const getRangesAsIndividualDates = (ranges: DateRange[]): Date[] => {
  const dates: Date[] = [];
  ranges.forEach((range) => {
    const current = new Date(range.start);
    while (current <= range.end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });
  return dates;
};

export const isDateInRanges = (date: Date, dateRanges: DateRange[]): boolean => {
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
};

export const isDateInCurrentRange = (
  date: Date,
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean
): boolean => {
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
  if (isDragging && dragStart && dragEnd && isValid(dragStart) && isValid(dragEnd)) {
    try {
      return isWithinInterval(startOfDay(date), {
        start: startOfDay(dragStart < dragEnd ? dragStart : dragEnd),
        end: startOfDay(dragStart < dragEnd ? dragEnd : dragStart),
      });
    } catch {}
  }
  
  return false;
};

export const hasAdjacentSelectedDate = (
  date: Date,
  direction: 'left' | 'right',
  dateRanges: DateRange[],
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean
): boolean => {
  if (!date || !isValid(date)) return false;
  const adjacentDate = new Date(date);
  adjacentDate.setDate(adjacentDate.getDate() + (direction === 'right' ? 1 : -1));
  return (
    isDateInRanges(adjacentDate, dateRanges) ||
    isDateInCurrentRange(adjacentDate, currentRange, dragStart, dragEnd, isDragging)
  );
};

export const findOverlappingRanges = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date
): number[] => {
  const overlappingIndices: number[] = [];
  dateRanges.forEach((range, index) => {
    try {
      const rangeStart = startOfDay(range.start);
      const rangeEnd = startOfDay(range.end);
      const normSelectionStart = startOfDay(selectionStart);
      const normSelectionEnd = startOfDay(selectionEnd);

      const hasOverlap = 
        isWithinInterval(normSelectionStart, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(normSelectionEnd, { start: rangeStart, end: rangeEnd }) ||
        isWithinInterval(rangeStart, { start: normSelectionStart, end: normSelectionEnd }) ||
        isWithinInterval(rangeEnd, { start: normSelectionStart, end: normSelectionEnd });

      if (hasOverlap) {
        overlappingIndices.push(index);
      }
    } catch {}
  });
  return overlappingIndices;
};

export const updateRangesWithSelection = (
  dateRanges: DateRange[],
  selectionStart: Date,
  selectionEnd: Date,
  shouldMergeRanges: boolean
): DateRange[] => {
  const normalizedStart = selectionStart < selectionEnd ? selectionStart : selectionEnd;
  const normalizedEnd = selectionStart < selectionEnd ? selectionEnd : selectionStart;

  const overlappingIndices = findOverlappingRanges(dateRanges, normalizedStart, normalizedEnd);

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

  if (shouldMergeRanges) {
    updatedRanges = mergeOverlappingRanges(updatedRanges);
  }

  return updatedRanges;
};

export const removeRangeByIndex = (dateRanges: DateRange[], index: number): DateRange[] => {
  return dateRanges.filter((_, i) => i !== index);
};

export const getAdjacentDate = (date: Date, direction: 'left' | 'right'): Date => {
  const adjacentDate = new Date(date);
  adjacentDate.setDate(adjacentDate.getDate() + (direction === 'right' ? 1 : -1));
  return adjacentDate;
};

export const calculateDayRoundingStyle = (
  day: Date,
  dateRanges: DateRange[],
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
  mergeRanges: boolean
): { shouldRoundLeft: boolean; shouldRoundRight: boolean } => {
  const isInSavedRange = isDateInRanges(day, dateRanges);
  const isInCurrent = isDateInCurrentRange(day, currentRange, dragStart, dragEnd, isDragging);
  const isSelected = isInSavedRange || isInCurrent;

  if (!isSelected) {
    return { shouldRoundLeft: false, shouldRoundRight: false };
  }

  // Check adjacent dates
  const hasLeftSelected = hasAdjacentSelectedDate(
    day,
    'left',
    dateRanges,
    currentRange,
    dragStart,
    dragEnd,
    isDragging
  );
  const hasRightSelected = hasAdjacentSelectedDate(
    day,
    'right',
    dateRanges,
    currentRange,
    dragStart,
    dragEnd,
    isDragging
  );
  
  const shouldRoundLeft = isSelected && !hasLeftSelected;
  const shouldRoundRight = isSelected && !hasRightSelected;

  return { shouldRoundLeft, shouldRoundRight };
};

export const findDateElementFromPoint = (
  clientX: number,
  clientY: number,
  dateButtonsMap: Map<string, HTMLElement>
): Date | null => {
  if (typeof document === 'undefined') return null;
  
  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return null;
  
  // Find which date button is under the pointer
  for (const [dateStr, button] of dateButtonsMap.entries()) {
    if (button === element || button.contains(element)) {
      const date = new Date(dateStr);
      if (isValid(date)) {
        return date;
      }
    }
  }
  
  return null;
};

export const shouldUpdateDragDate = (currentDate: Date | null, newDate: Date): boolean => {
  if (!currentDate || !isValid(currentDate)) return true;
  if (!newDate || !isValid(newDate)) return false;
  return !isSameDay(newDate, currentDate);
};

export const commitDragSelection = (
  dragStart: Date | null,
  dragEnd: Date | null,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
  returnIndividualDates?: boolean
): DateRange[] | null => {
  if (!dragStart || !dragEnd || !isValid(dragStart) || !isValid(dragEnd)) {
    return null;
  }

  const updatedRanges = updateRangesWithSelection(dateRanges, dragStart, dragEnd, mergeRanges);

  if (onChange) {
    onChange(updatedRanges);
  }
  
  if (onIndividualDatesChange || returnIndividualDates) {
    const individualDates = getRangesAsIndividualDates(updatedRanges);
    if (onIndividualDatesChange) {
      onIndividualDatesChange(individualDates);
    }
  }

  return updatedRanges;
};

export const handleRangeChangeLogic = (
  newValue: MUIDateRange<Date>,
  isDragging: boolean,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
  returnIndividualDates?: boolean
): { shouldUpdate: boolean; updatedRanges?: DateRange[] } => {
  // Only update if not dragging (to avoid interference)
  if (isDragging) {
    return { shouldUpdate: false };
  }
  
  // If both start and end are selected, commit the range from picker
  if (newValue[0] && newValue[1]) {
    const [start, end] = newValue;
    if (!start || !end) return { shouldUpdate: false };
    
    const updatedRanges = updateRangesWithSelection(dateRanges, start, end, mergeRanges);
    
    if (onChange) {
      onChange(updatedRanges);
    }
    
    if (onIndividualDatesChange || returnIndividualDates) {
      const individualDates = getRangesAsIndividualDates(updatedRanges);
      if (onIndividualDatesChange) {
        onIndividualDatesChange(individualDates);
      }
    }
    
    return { shouldUpdate: true, updatedRanges };
  }
  
  return { shouldUpdate: true };
};

export const handlePointerDownLogic = (
  date: Date
): { dragStart: Date; dragEnd: Date } | null => {
  if (!date || !isValid(date)) return null;
  
  return {
    dragStart: date,
    dragEnd: date
  };
};

export const handlePointerMoveLogic = (
  date: Date,
  isDragging: boolean,
  dragStart: Date | null,
  currentDragEnd: Date | null
): Date | null => {
  if (!isDragging || !dragStart) return null;
  if (!date || !isValid(date)) return null;
  
  if (shouldUpdateDragDate(currentDragEnd, date)) {
    return date;
  }
  
  return null;
};

export const handleRemoveRangeLogic = (
  index: number,
  dateRanges: DateRange[],
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
  returnIndividualDates?: boolean
): DateRange[] => {
  const updatedRanges = removeRangeByIndex(dateRanges, index);
  
  if (onChange) {
    onChange(updatedRanges);
  }
  
  if (onIndividualDatesChange || returnIndividualDates) {
    const individualDates = getRangesAsIndividualDates(updatedRanges);
    if (onIndividualDatesChange) {
      onIndividualDatesChange(individualDates);
    }
  }
  
  return updatedRanges;
};

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

  const commitDragSelectionCallback = useCallback(() => {
    const updatedRanges = commitDragSelection(
      dragStartRef.current,
      dragEndRef.current,
      dateRanges,
      mergeRanges,
      onChange,
      onIndividualDatesChange,
      returnIndividualDates
    );
    
    if (updatedRanges) {
      setDateRanges(updatedRanges);
    }
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates, mergeRanges]);

  const handleRangeChange = useCallback((newValue: MUIDateRange<Date>) => {
    if (!isDraggingRef.current) {
      setCurrentRange(newValue);
      
      if (newValue[0] && newValue[1]) {
        setTimeout(() => {
          const result = handleRangeChangeLogic(
            newValue,
            isDraggingRef.current,
            dateRanges,
            mergeRanges,
            onChange,
            onIndividualDatesChange,
            returnIndividualDates
          );
          
          if (result.shouldUpdate && result.updatedRanges) {
            setDateRanges(result.updatedRanges);
            setCurrentRange([null, null]);
          }
        }, 0);
      }
    }
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates, mergeRanges]);

  const handlePointerDown = useCallback((date: Date, e: React.PointerEvent) => {
    const result = handlePointerDownLogic(date);
    if (!result) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDraggingRef.current = true;
    dragStartRef.current = result.dragStart;
    dragEndRef.current = result.dragEnd;
    
    const target = e.target as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
    forceUpdate({});
  }, []);

  const handlePointerMove = useCallback((date: Date) => {
    const newDragEnd = handlePointerMoveLogic(
      date,
      isDraggingRef.current,
      dragStartRef.current,
      dragEndRef.current
    );
    
    if (newDragEnd) {
      dragEndRef.current = newDragEnd;
      forceUpdate({});
    }
  }, []);

  const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const date = findDateElementFromPoint(e.clientX, e.clientY, dateButtonsRef.current);
    if (date) {
      handlePointerMove(date);
    }
  }, [handlePointerMove]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    commitDragSelectionCallback();
    
    isDraggingRef.current = false;
    dragStartRef.current = null;
    dragEndRef.current = null;
    forceUpdate({});
  }, [commitDragSelectionCallback]);

  const handleRemoveRange = useCallback((index: number) => {
    const updatedRanges = handleRemoveRangeLogic(
      index,
      dateRanges,
      onChange,
      onIndividualDatesChange,
      returnIndividualDates
    );
    setDateRanges(updatedRanges);
  }, [dateRanges, onChange, onIndividualDatesChange, returnIndividualDates]);

  const CustomDay = useCallback(
    (props: PickersDayProps) => {
      const { day, ...other } = props;
      
      if (!day || !isValid(day)) {
        return <PickersDay day={day} {...other} />;
      }

      const isInSavedRange = isDateInRanges(day, dateRanges);
      const isInCurrent = isDateInCurrentRange(
        day,
        currentRange,
        dragStartRef.current,
        dragEndRef.current,
        isDraggingRef.current
      );
      const isSelected = isInSavedRange || isInCurrent;

      const { shouldRoundLeft, shouldRoundRight } = calculateDayRoundingStyle(
        day,
        dateRanges,
        currentRange,
        dragStartRef.current,
        dragEndRef.current,
        isDraggingRef.current,
        mergeRanges
      );

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
    [dateRanges, currentRange, handlePointerDown, mergeRanges]
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
