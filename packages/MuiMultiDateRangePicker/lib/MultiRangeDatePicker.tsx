import { Box, useTheme } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { isValid, isWithinInterval, startOfDay } from 'date-fns';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import {
  findDateElementFromPoint,
  getAdjacentDate,
  getRangesAsIndividualDates,
  handlePointerDownLogic,
  handlePointerMoveLogic,
  isDateInRanges,
  updateRangesWithSelection,
} from '../../../lib';
import type { DateRange, MultiRangeDatePickerProps } from './types';

export const areDatesInSameRange = (
  date1: Date,
  date2: Date,
  dateRanges: DateRange[],
): boolean => {
  if (!date1 || !date2 || !isValid(date1) || !isValid(date2)) return false;
  return dateRanges.some((range) => {
    try {
      if (!isValid(range.start) || !isValid(range.end)) return false;
      const inRange1 = isWithinInterval(startOfDay(date1), {
        start: startOfDay(range.start),
        end: startOfDay(range.end),
      });
      const inRange2 = isWithinInterval(startOfDay(date2), {
        start: startOfDay(range.start),
        end: startOfDay(range.end),
      });
      return inRange1 && inRange2;
    } catch {
      return false;
    }
  });
};

export const hasAdjacentSelectedDate = (
  date: Date,
  direction: 'left' | 'right',
  dateRanges: DateRange[],
): boolean => {
  if (!date || !isValid(date)) return false;
  const adjacentDate = new Date(date);
  adjacentDate.setDate(
    adjacentDate.getDate() + (direction === 'right' ? 1 : -1),
  );
  return isDateInRanges(adjacentDate, dateRanges);
};

export const isDateInHoverRange = (
  date: Date,
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
): boolean => {
  if (
    !isDragging ||
    !dragStart ||
    !dragEnd ||
    !isValid(dragStart) ||
    !isValid(dragEnd)
  ) {
    return false;
  }
  const start = dragStart < dragEnd ? dragStart : dragEnd;
  const end = dragStart < dragEnd ? dragEnd : dragStart;
  try {
    return isWithinInterval(startOfDay(date), {
      start: startOfDay(start),
      end: startOfDay(end),
    });
  } catch {
    return false;
  }
};

export const calculateDayRoundingStyleForCalendar = (
  day: Date,
  dateRanges: DateRange[],
  dragStart: Date | null,
  dragEnd: Date | null,
  isDragging: boolean,
  mergeRanges: boolean,
): {
  shouldRoundLeft: boolean;
  shouldRoundRight: boolean;
  isInRange: boolean;
  isHovered: boolean;
} => {
  const isInRange = isDateInRanges(day, dateRanges);
  const isHovered = isDateInHoverRange(day, dragStart, dragEnd, isDragging);

  if (!isInRange && !isHovered) {
    return {
      shouldRoundLeft: false,
      shouldRoundRight: false,
      isInRange,
      isHovered,
    };
  }

  // Check adjacent dates for both selected ranges and hover state
  const hasLeftSelected = hasAdjacentSelectedDate(day, 'left', dateRanges);
  const hasRightSelected = hasAdjacentSelectedDate(day, 'right', dateRanges);

  // Check if adjacent dates are in the SAME range as this day
  const leftDate = getAdjacentDate(day, 'left');
  const rightDate = getAdjacentDate(day, 'right');

  // Check if adjacent dates are in the hover selection
  const hasLeftHovered = isDateInHoverRange(
    leftDate,
    dragStart,
    dragEnd,
    isDragging,
  );
  const hasRightHovered = isDateInHoverRange(
    rightDate,
    dragStart,
    dragEnd,
    isDragging,
  );

  // For permanent ranges adjacent to hover, check if we should connect
  const hasLeftHoveredAdjacent = isInRange && !isHovered && hasLeftHovered;
  const hasRightHoveredAdjacent = isInRange && !isHovered && hasRightHovered;

  // Determine if adjacent dates are in same range (only when not hovering)
  const leftInSameRange =
    !isHovered &&
    hasLeftSelected &&
    areDatesInSameRange(day, leftDate, dateRanges);
  const rightInSameRange =
    !isHovered &&
    hasRightSelected &&
    areDatesInSameRange(day, rightDate, dateRanges);

  // Determine if we should round edges
  // When mergeRanges is true: connect hovered to adjacent ranges
  // When mergeRanges is false: never connect hovered to adjacent ranges
  const shouldRoundLeft = isHovered
    ? !hasLeftHovered && !(mergeRanges && hasLeftSelected)
    : isInRange && !leftInSameRange && !(mergeRanges && hasLeftHoveredAdjacent);
  const shouldRoundRight = isHovered
    ? !hasRightHovered && !(mergeRanges && hasRightSelected)
    : isInRange &&
      !rightInSameRange &&
      !(mergeRanges && hasRightHoveredAdjacent);

  return { shouldRoundLeft, shouldRoundRight, isInRange, isHovered };
};

export const commitSelection = (
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

// MUI PickersDay constants - exported for testing
export const DAY_SIZE = 36;
export const DAY_MARGIN = 2;

export const generateDayButtonStyles = (
  isInRange: boolean,
  isHovered: boolean,
  shouldRoundLeft: boolean,
  shouldRoundRight: boolean,
  DAY_SIZE: number,
  DAY_MARGIN: number,
  captionTypography: {
    fontSize?: string | number;
    fontWeight?: string | number;
  },
) => {
  return {
    ...captionTypography,
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: 0,
    border: 'none',
    margin: `0 ${DAY_MARGIN}px`,
    padding: 0,
    fontFamily: 'inherit',
    cursor: 'pointer',
    position: 'relative' as const,
    backgroundColor: isInRange || isHovered ? 'primary.main' : 'transparent',
    color: isInRange || isHovered ? 'primary.contrastText' : 'text.primary',
    transition: 'none',
    '&:hover': {
      backgroundColor: isInRange || isHovered ? 'primary.dark' : 'action.hover',
    },
    // Fill gaps on left side for range continuity
    ...((isInRange || isHovered) &&
      !shouldRoundLeft && {
        '&::before': {
          content: '""',
          position: 'absolute' as const,
          left: -DAY_MARGIN,
          top: 0,
          width: DAY_MARGIN,
          height: '100%',
          backgroundColor: 'primary.main',
        },
      }),
    // Fill gaps on right side for range continuity
    ...((isInRange || isHovered) &&
      !shouldRoundRight && {
        '&::after': {
          content: '""',
          position: 'absolute' as const,
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
    ...(!isInRange &&
      !isHovered && {
        borderRadius: '50%',
      }),
    touchAction: 'none' as const,
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none' as const,
    userSelect: 'none' as const,
  };
};

// Export ALL the logic functions that were inside useCallback
export const createCommitSelectionCallback = (
  dragStartRef: React.RefObject<Date | null>,
  dragEndRef: React.RefObject<Date | null>,
  dateRanges: DateRange[],
  mergeRanges: boolean,
  onChange?: (ranges: DateRange[]) => void,
  onIndividualDatesChange?: (dates: Date[]) => void,
) => {
  return () => {
    const updatedRanges = commitSelection(
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

export const createHandlePointerDown = (
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

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    forceUpdate();
  };
};

export const createHandlePointerMove = (
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

export const createHandleContainerPointerMove = (
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

export const createHandlePointerUp = (
  isDraggingRef: React.MutableRefObject<boolean>,
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  commitSelectionCallback: () => DateRange[] | null,
  forceUpdate: () => void,
) => {
  return () => {
    if (!isDraggingRef.current) return;

    commitSelectionCallback();

    isDraggingRef.current = false;
    dragStartRef.current = null;
    dragEndRef.current = null;
    forceUpdate();
  };
};

export const createCustomDay = (
  dateRanges: DateRange[],
  dragStartRef: React.MutableRefObject<Date | null>,
  dragEndRef: React.MutableRefObject<Date | null>,
  isDraggingRef: React.MutableRefObject<boolean>,
  mergeRanges: boolean,
  DAY_SIZE: number,
  DAY_MARGIN: number,
  captionTypography: {
    fontSize?: string | number;
    fontWeight?: string | number;
  },
  dateButtonsRef: React.MutableRefObject<Map<string, HTMLElement>>,
  handlePointerDown: (date: Date, e: React.PointerEvent) => void,
) => {
  return (props: PickersDayProps) => {
    const { day } = props;

    if (!day || !isValid(day)) {
      return null;
    }

    const { shouldRoundLeft, shouldRoundRight, isInRange, isHovered } =
      calculateDayRoundingStyleForCalendar(
        day,
        dateRanges,
        dragStartRef.current,
        dragEndRef.current,
        isDraggingRef.current,
        mergeRanges,
      );

    const styles = generateDayButtonStyles(
      isInRange,
      isHovered,
      shouldRoundLeft,
      shouldRoundRight,
      DAY_SIZE,
      DAY_MARGIN,
      captionTypography,
    );

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
        sx={styles}
      >
        {day.getDate()}
      </Box>
    );
  };
};

const MultiRangeDatePicker: React.FC<MultiRangeDatePickerProps> = ({
  onChange,
  onIndividualDatesChange,
  mergeRanges = false,
}) => {
  const theme = useTheme();
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const dragEndRef = useRef<Date | null>(null);
  const dateButtonsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [, setForceUpdateState] = useState({});
  const forceUpdate = useCallback(() => setForceUpdateState({}), []);

  const commitSelectionCallback = useCallback(() => {
    const factory = createCommitSelectionCallback(
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

  const handlePointerDown = useCallback(
    createHandlePointerDown(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      forceUpdate,
    ),
    [],
  );

  const handlePointerMove = useCallback(
    createHandlePointerMove(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      forceUpdate,
    ),
    [],
  );

  const handleContainerPointerMove = useCallback(
    createHandleContainerPointerMove(
      isDraggingRef,
      dateButtonsRef,
      handlePointerMove,
    ),
    [],
  );

  const handlePointerUp = useCallback(
    createHandlePointerUp(
      isDraggingRef,
      dragStartRef,
      dragEndRef,
      commitSelectionCallback,
      forceUpdate,
    ),
    [],
  );

  const CustomDay = useCallback(
    createCustomDay(
      dateRanges,
      dragStartRef,
      dragEndRef,
      isDraggingRef,
      mergeRanges,
      DAY_SIZE,
      DAY_MARGIN,
      theme.typography.caption,
      dateButtonsRef,
      handlePointerDown,
    ),
    [],
  );

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
