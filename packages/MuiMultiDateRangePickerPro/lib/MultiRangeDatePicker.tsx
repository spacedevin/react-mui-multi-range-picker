import type React from 'react';
import { useState, useCallback, useRef } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  PickersDay,
  type PickersDayProps,
} from '@mui/x-date-pickers/PickersDay';
import { Box, Chip, Stack, Paper } from '@mui/material';
import type { DateRange as MUIDateRange } from '@mui/x-date-pickers-pro/models';
import { isWithinInterval, startOfDay, isValid } from 'date-fns';
import type { DateRange, MultiRangeDatePickerProps } from './types';
import {
  getRangesAsIndividualDates,
  isDateInRanges,
  updateRangesWithSelection,
  findDateElementFromPoint,
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from '../../../lib';

export const isDateInCurrentRange = (
  date: Date,
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
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
  if (
    isDragging &&
    dragStart &&
    dragEnd &&
    isValid(dragStart) &&
    isValid(dragEnd)
  ) {
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
  isDragging: boolean,
): boolean => {
  if (!date || !isValid(date)) return false;
  const adjacentDate = new Date(date);
  adjacentDate.setDate(
    adjacentDate.getDate() + (direction === 'right' ? 1 : -1),
  );
  return (
    isDateInRanges(adjacentDate, dateRanges) ||
    isDateInCurrentRange(
      adjacentDate,
      currentRange,
      dragStart,
      dragEnd,
      isDragging,
    )
  );
};

export const removeRangeByIndex = (
  dateRanges: DateRange[],
  index: number,
): DateRange[] => {
  return dateRanges.filter((_, i) => i !== index);
};

export const calculateDayRoundingStyle = (
  day: Date,
  dateRanges: DateRange[],
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
  mergeRanges: boolean,
): { shouldRoundLeft: boolean; shouldRoundRight: boolean } => {
  const isInSavedRange = isDateInRanges(day, dateRanges);
  const isInCurrent = isDateInCurrentRange(
    day,
    currentRange,
    dragStart,
    dragEnd,
    isDragging,
  );
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
    isDragging,
  );
  const hasRightSelected = hasAdjacentSelectedDate(
    day,
    'right',
    dateRanges,
    currentRange,
    dragStart,
    dragEnd,
    isDragging,
  );

  const shouldRoundLeft = isSelected && !hasLeftSelected;
  const shouldRoundRight = isSelected && !hasRightSelected;

  return { shouldRoundLeft, shouldRoundRight };
};

export const commitDragSelection = (
  dragStart: Date | null,
  dragEnd: Date | null,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
): DateRange[] | null => {
  if (!dragStart || !dragEnd || !isValid(dragStart) || !isValid(dragEnd)) {
    return null;
  }

  const updatedRanges = updateRangesWithSelection(
    dateRanges,
    dragStart,
    dragEnd,
    mergeRanges,
  );

  if (onChange) {
    onChange(updatedRanges);
  }

  if (onIndividualDatesChange) {
    const individualDates = getRangesAsIndividualDates(updatedRanges);
    onIndividualDatesChange(individualDates);
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
): { shouldUpdate: boolean; updatedRanges?: DateRange[] } => {
  // Only update if not dragging (to avoid interference)
  if (isDragging) {
    return { shouldUpdate: false };
  }

  // If both start and end are selected, commit the range from picker
  if (newValue[0] && newValue[1]) {
    const [start, end] = newValue;
    if (!start || !end) return { shouldUpdate: false };

    const updatedRanges = updateRangesWithSelection(
      dateRanges,
      start,
      end,
      mergeRanges,
    );

    if (onChange) {
      onChange(updatedRanges);
    }

    if (onIndividualDatesChange) {
      const individualDates = getRangesAsIndividualDates(updatedRanges);
      onIndividualDatesChange(individualDates);
    }

    return { shouldUpdate: true, updatedRanges };
  }

  return { shouldUpdate: true };
};

export const handleRemoveRangeLogic = (
  index: number,
  dateRanges: DateRange[],
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
): DateRange[] => {
  const updatedRanges = removeRangeByIndex(dateRanges, index);

  if (onChange) {
    onChange(updatedRanges);
  }

  if (onIndividualDatesChange) {
    const individualDates = getRangesAsIndividualDates(updatedRanges);
    onIndividualDatesChange(individualDates);
  }

  return updatedRanges;
};

// MUI PickersDay constants - exported for testing
export const DAY_SIZE_PRO = 36;
export const DAY_MARGIN_PRO = 2;

export const generatePickersDayStyles = (
  isSelected: boolean,
  shouldRoundLeft: boolean,
  shouldRoundRight: boolean,
) => {
  return {
    backgroundColor: isSelected ? 'primary.main' : undefined,
    color: isSelected ? 'primary.contrastText' : undefined,
    transition: 'none',
    '&:hover': {
      backgroundColor: isSelected ? 'primary.dark' : undefined,
    },
    borderRadius: '50%',
    ...(isSelected &&
      !shouldRoundLeft &&
      !shouldRoundRight && {
        borderRadius: 0,
      }),
    ...(shouldRoundLeft &&
      !shouldRoundRight && {
        borderRadius: '50% 0 0 50%',
      }),
    ...(shouldRoundRight &&
      !shouldRoundLeft && {
        borderRadius: '0 50% 50% 0',
      }),
    position: 'relative' as const,
    touchAction: 'none' as const,
    userSelect: 'none' as const,
    // Fill gaps for range continuity
    ...(!shouldRoundLeft &&
      isSelected && {
        '&::before': {
          content: '""',
          position: 'absolute' as const,
          left: -2,
          top: 0,
          width: 2,
          height: '100%',
          backgroundColor: 'primary.main',
        },
      }),
    ...(!shouldRoundRight &&
      isSelected && {
        '&::after': {
          content: '""',
          position: 'absolute' as const,
          right: -2,
          top: 0,
          width: 2,
          height: '100%',
          backgroundColor: 'primary.main',
        },
      }),
  };
};

export const generateDayWrapperStyles = () => {
  return {
    display: 'inline-block',
    position: 'relative' as const,
  };
};

// Export ALL the logic functions that were inside useCallback
export const createCommitDragSelectionCallback = (
  dragStartRef: React.RefObject<Date | null>,
  dragEndRef: React.RefObject<Date | null>,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
) => {
  return () => {
    const updatedRanges = commitDragSelection(
      dragStartRef.current,
      dragEndRef.current,
      dateRanges,
      mergeRanges,
      onChange,
      onIndividualDatesChange,
    );
    return updatedRanges;
  };
};

export const createHandleRangeChange = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
) => {
  return (newValue: MUIDateRange<Date>) => {
    if (!isDraggingRef.current) {
      if (newValue[0] && newValue[1]) {
        return {
          shouldUpdate: true,
          callback: () => {
            const result = handleRangeChangeLogic(
              newValue,
              isDraggingRef.current,
              dateRanges,
              mergeRanges,
              onChange,
              onIndividualDatesChange,
            );
            return result;
          },
        };
      }
      return { shouldUpdate: true, newRange: newValue };
    }
    return { shouldUpdate: false };
  };
};

export const createHandlePointerDownPro = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  forceUpdate: () => void,
) => {
  return (date: Date, e: React.PointerEvent) => {
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
    forceUpdate();
  };
};

export const createHandlePointerMovePro = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  forceUpdate: () => void,
) => {
  return (date: Date) => {
    const newDragEnd = handlePointerMoveLogic(
      date,
      isDraggingRef.current,
      dragStartRef.current,
      dragEndRef.current,
    );

    if (newDragEnd) {
      dragEndRef.current = newDragEnd;
      forceUpdate();
    }
  };
};

export const createHandleContainerPointerMovePro = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dateButtonsRef: React.MutableRefObject<Map<string, HTMLElement>>,
  handlePointerMove: (date: Date) => void,
) => {
  return (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const date = findDateElementFromPoint(
      e.clientX,
      e.clientY,
      dateButtonsRef.current,
    );
    if (date) {
      handlePointerMove(date);
    }
  };
};

export const createHandlePointerUpPro = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  commitDragSelectionCallback: () => DateRange[] | null,
  forceUpdate: () => void,
) => {
  return () => {
    if (!isDraggingRef.current) return;

    commitDragSelectionCallback();

    isDraggingRef.current = false;
    dragStartRef.current = null;
    dragEndRef.current = null;
    forceUpdate();
  };
};

export const createHandleRemoveRange = (
  dateRanges: DateRange[],
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
) => {
  return (index: number) => {
    const updatedRanges = handleRemoveRangeLogic(
      index,
      dateRanges,
      onChange,
      onIndividualDatesChange,
    );
    return updatedRanges;
  };
};

export const calculateDaySelection = (
  day: Date,
  dateRanges: DateRange[],
  currentRange: MUIDateRange<Date>,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
): boolean => {
  const isInSavedRange = isDateInRanges(day, dateRanges);
  const isInCurrent = isDateInCurrentRange(
    day,
    currentRange,
    dragStart,
    dragEnd,
    isDragging,
  );
  return isInSavedRange || isInCurrent;
};

export const createCustomDayPro = (
  dateRanges: DateRange[],
  currentRange: MUIDateRange<Date>,
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  isDraggingRef: React.MutableRefObject<boolean>,
  mergeRanges: boolean,
  dateButtonsRef: React.MutableRefObject<Map<string, HTMLElement>>,
  handlePointerDown: (date: Date, e: React.PointerEvent) => void,
) => {
  return (props: PickersDayProps) => {
    const { day, ...other } = props;

    if (!day || !isValid(day)) {
      return <PickersDay day={day} {...other} />;
    }

    const isSelected = calculateDaySelection(
      day,
      dateRanges,
      currentRange,
      dragStartRef.current,
      dragEndRef.current,
      isDraggingRef.current,
    );

    const { shouldRoundLeft, shouldRoundRight } = calculateDayRoundingStyle(
      day,
      dateRanges,
      currentRange,
      dragStartRef.current,
      dragEndRef.current,
      isDraggingRef.current,
      mergeRanges,
    );

    const wrapperStyles = generateDayWrapperStyles();
    const dayStyles = generatePickersDayStyles(
      isSelected,
      shouldRoundLeft,
      shouldRoundRight,
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
        sx={wrapperStyles}
      >
        <PickersDay {...other} day={day} sx={dayStyles} />
      </Box>
    );
  };
};

const MultiRangeDatePicker: React.FC<MultiRangeDatePickerProps> = ({
  onChange,
  onIndividualDatesChange,
  mergeRanges = false,
}) => {
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [currentRange, setCurrentRange] = useState<MUIDateRange<Date>>([
    null,
    null,
  ]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const dragEndRef = useRef<Date | null>(null);
  const dateButtonsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [, setForceUpdateState] = useState({});
  const forceUpdate = useCallback(() => setForceUpdateState({}), []);

  const commitDragSelectionCallback = useCallback(() => {
    const factory = createCommitDragSelectionCallback(
      dragStartRef,
      dragEndRef,
      dateRanges,
      mergeRanges,
      onChange,
      onIndividualDatesChange,
    );
    const updatedRanges = factory();
    if (updatedRanges) {
      setDateRanges(updatedRanges);
    }
    return updatedRanges;
  }, [dateRanges, onChange, onIndividualDatesChange, mergeRanges]);

  const handleRangeChange = useCallback(
    (newValue: MUIDateRange<Date>) => {
      const factory = createHandleRangeChange(
        isDraggingRef,
        dateRanges,
        mergeRanges,
        onChange,
        onIndividualDatesChange,
      );
      const result = factory(newValue);

      if (result.shouldUpdate) {
        if (result.newRange) {
          setCurrentRange(result.newRange);
        }
        if (result.callback) {
          setTimeout(() => {
            const logicResult = result.callback();
            if (
              logicResult &&
              logicResult.shouldUpdate &&
              logicResult.updatedRanges
            ) {
              setDateRanges(logicResult.updatedRanges);
              setCurrentRange([null, null]);
            }
          }, 0);
        }
      }
    },
    [dateRanges, onChange, onIndividualDatesChange, mergeRanges],
  );

  const handlePointerDown = useCallback(
    createHandlePointerDownPro(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      forceUpdate,
    ),
    [forceUpdate],
  );

  const handlePointerMove = useCallback(
    createHandlePointerMovePro(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      forceUpdate,
    ),
    [forceUpdate],
  );

  const handleContainerPointerMove = useCallback(
    createHandleContainerPointerMovePro(
      isDraggingRef,
      dateButtonsRef,
      handlePointerMove,
    ),
    [handlePointerMove],
  );

  const handlePointerUp = useCallback(
    createHandlePointerUpPro(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      commitDragSelectionCallback,
      forceUpdate,
    ),
    [commitDragSelectionCallback, forceUpdate],
  );

  const handleRemoveRange = useCallback(
    (index: number) => {
      const factory = createHandleRemoveRange(
        dateRanges,
        onChange,
        onIndividualDatesChange,
      );
      const updatedRanges = factory(index);
      setDateRanges(updatedRanges);
    },
    [dateRanges, onChange, onIndividualDatesChange],
  );

  const CustomDay = useCallback(
    createCustomDayPro(
      dateRanges,
      currentRange,
      dragStartRef,
      dragEndRef,
      isDraggingRef,
      mergeRanges,
      dateButtonsRef,
      handlePointerDown,
    ),
    [dateRanges, currentRange, mergeRanges, handlePointerDown],
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
