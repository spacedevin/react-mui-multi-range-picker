import React, { useState, useCallback, useRef } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Box, useTheme } from '@mui/material';
import { isSameDay, isWithinInterval, startOfDay, isValid } from 'date-fns';
import type { DateRange, MultiRangeDatePickerProps } from './types';

const MultiRangeDatePicker: React.FC<MultiRangeDatePickerProps> = ({ 
  onChange, 
  onIndividualDatesChange,
  mergeRanges = false,
  returnIndividualDates = false 
}) => {
  const theme = useTheme();
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const dragEndRef = useRef<Date | null>(null);
  const dateButtonsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [, forceUpdate] = useState({});

  // MUI PickersDay constants
  const DAY_SIZE = 36;
  const DAY_MARGIN = 2;

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

  const hasAdjacentSelectedDate = useCallback(
    (date: Date, direction: 'left' | 'right') => {
      if (!date || !isValid(date)) return false;
      const adjacentDate = new Date(date);
      adjacentDate.setDate(adjacentDate.getDate() + (direction === 'right' ? 1 : -1));
      return isDateInRange(adjacentDate);
    },
    [isDateInRange]
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

  const commitSelection = useCallback(() => {
    const dragStart = dragStartRef.current;
    const dragEnd = dragEndRef.current;
    
    if (!dragStart || !dragEnd || !isValid(dragStart) || !isValid(dragEnd)) {
      return;
    }

    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;

    const overlappingIndices: number[] = [];
    dateRanges.forEach((range, index) => {
      try {
        const rangeStart = startOfDay(range.start);
        const rangeEnd = startOfDay(range.end);
        const selectionStart = startOfDay(start);
        const selectionEnd = startOfDay(end);

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
        start: startOfDay(start),
        end: startOfDay(end),
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

  const handlePointerDown = useCallback((date: Date, e: React.PointerEvent) => {
    if (!date || !isValid(date)) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDraggingRef.current = true;
    dragStartRef.current = date;
    dragEndRef.current = date;
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
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
    
    commitSelection();
    
    isDraggingRef.current = false;
    dragStartRef.current = null;
    dragEndRef.current = null;
    forceUpdate({});
  }, [commitSelection]);

  const CustomDay = useCallback((props: PickersDayProps) => {
    const { day } = props;
    
    if (!day || !isValid(day)) {
      return null;
    }

    const isInRange = isDateInRange(day);

    let isHovered = false;
    const dragStart = dragStartRef.current;
    const dragEnd = dragEndRef.current;
    
    if (isDraggingRef.current && dragStart && dragEnd && isValid(dragStart) && isValid(dragEnd)) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      try {
        isHovered = isWithinInterval(startOfDay(day), {
          start: startOfDay(start),
          end: startOfDay(end),
        });
      } catch {}
    }

    // Check adjacent dates for both selected ranges and hover state
    const hasLeftSelected = hasAdjacentSelectedDate(day, 'left');
    const hasRightSelected = hasAdjacentSelectedDate(day, 'right');
    
    // For hover state, check if adjacent dates are also in the drag selection
    let hasLeftHovered = false;
    let hasRightHovered = false;
    
    if (isHovered && dragStart && dragEnd) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      
      const leftDate = new Date(day);
      leftDate.setDate(leftDate.getDate() - 1);
      const rightDate = new Date(day);
      rightDate.setDate(rightDate.getDate() + 1);
      
      try {
        hasLeftHovered = isWithinInterval(startOfDay(leftDate), {
          start: startOfDay(start),
          end: startOfDay(end),
        });
        hasRightHovered = isWithinInterval(startOfDay(rightDate), {
          start: startOfDay(start),
          end: startOfDay(end),
        });
      } catch {}
    }
    
    // For permanent ranges, check if adjacent to hovered dates
    let hasLeftHoveredAdjacent = false;
    let hasRightHoveredAdjacent = false;
    if (isInRange && !isHovered && dragStart && dragEnd && isDraggingRef.current) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      
      const leftDate = new Date(day);
      leftDate.setDate(leftDate.getDate() - 1);
      const rightDate = new Date(day);
      rightDate.setDate(rightDate.getDate() + 1);
      
      try {
        hasLeftHoveredAdjacent = isWithinInterval(startOfDay(leftDate), { start: startOfDay(start), end: startOfDay(end) });
        hasRightHoveredAdjacent = isWithinInterval(startOfDay(rightDate), { start: startOfDay(start), end: startOfDay(end) });
      } catch {}
    }
    
    const shouldRoundLeft = (isInRange || isHovered) && !hasLeftSelected && !hasLeftHovered && !hasLeftHoveredAdjacent;
    const shouldRoundRight = (isInRange || isHovered) && !hasRightSelected && !hasRightHovered && !hasRightHoveredAdjacent;

    return (
      <Box
        component="button"
        type="button"
        ref={(el: HTMLElement | null) => {
          if (el) {
            dateButtonsRef.current.set(day.toISOString(), el);
          }
        }}
        data-date={day.toISOString()}
        onPointerDown={(e) => handlePointerDown(day, e)}
        sx={{
          ...theme.typography.caption,
          width: DAY_SIZE,
          height: DAY_SIZE,
          borderRadius: 0,
          border: 'none',
          margin: `0 ${DAY_MARGIN}px`,
          padding: 0,
          fontFamily: 'inherit',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: (isInRange || isHovered) ? 'primary.main' : 'transparent',
          color: (isInRange || isHovered) ? 'primary.contrastText' : 'text.primary',
          transition: 'none',
          '&:hover': {
            backgroundColor: (isInRange || isHovered) ? 'primary.dark' : 'action.hover',
          },
          // Fill gaps on left side for range continuity
          ...((isInRange || isHovered) && !shouldRoundLeft && {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -DAY_MARGIN,
              top: 0,
              width: DAY_MARGIN,
              height: '100%',
              backgroundColor: 'primary.main',
            },
          }),
          // Fill gaps on right side for range continuity
          ...((isInRange || isHovered) && !shouldRoundRight && {
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -DAY_MARGIN,
              top: 0,
              width: DAY_MARGIN,
              height: '100%',
              backgroundColor: 'primary.main',
            },
          }),
          ...(shouldRoundLeft && {
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
          }),
          ...(shouldRoundRight && {
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%',
          }),
          ...(!isInRange && !isHovered && {
            borderRadius: '50%',
          }),
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {day.getDate()}
      </Box>
    );
  }, [isDateInRange, handlePointerDown, hasAdjacentSelectedDate]);

  return (
    <Box
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      sx={{
        position: 'relative',
        display: 'inline-block',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          showDaysOutsideCurrentMonth
          fixedWeekNumber={6}
          slots={{
            day: CustomDay,
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default MultiRangeDatePicker;
