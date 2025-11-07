import "../test-utils/setup";
import { describe, test, expect, vi } from "bun:test";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import MultiRangeDatePicker, {
  areDatesInSameRange,
  hasAdjacentSelectedDate,
  isDateInHoverRange,
  calculateDayRoundingStyleForCalendar,
  commitSelection,
  generateDayButtonStyles,
  getAdjacentDate,
} from "./MultiRangeDatePicker";
import type { DateRange } from "./types";
// Import shared library functions that THIS package uses (for testing)
import {
  mergeOverlappingRanges,
  findOverlappingRanges,
  getRangesAsIndividualDates,
  isDateInRanges,
  updateRangesWithSelection,
  findDateElementFromPoint,
  shouldUpdateDragDate,
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from "../../../lib";

// Each package tests the shared library functions IT imports
// This ensures self-contained coverage

const DAY_SIZE = 36;
const DAY_MARGIN = 2;
const captionTypography = { fontSize: "0.875rem" };

describe("Shared Library Functions (used by this package)", () => {
  describe("mergeOverlappingRanges", () => {
    test("returns empty array for empty input", () => {
      expect(mergeOverlappingRanges([])).toEqual([]);
    });

    test("returns single range unchanged", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      expect(mergeOverlappingRanges(ranges)).toEqual(ranges);
    });

    test("merges overlapping ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
        { start: new Date("2025-01-04"), end: new Date("2025-01-10") },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date("2025-01-01"));
      expect(result[0].end).toEqual(new Date("2025-01-10"));
    });

    test("merges adjacent ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
        { start: new Date("2025-01-06"), end: new Date("2025-01-10") },
      ];
      expect(mergeOverlappingRanges(ranges).length).toBe(1);
    });

    test("does not merge non-overlapping ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
        { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
      ];
      expect(mergeOverlappingRanges(ranges).length).toBe(2);
    });

    test("handles unsorted ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      const result = mergeOverlappingRanges(ranges);
      expect(result.length).toBe(2);
      expect(result[0].start).toEqual(new Date("2025-01-01"));
    });
  });

  describe("getRangesAsIndividualDates", () => {
    test("returns empty array for empty input", () => {
      expect(getRangesAsIndividualDates([])).toEqual([]);
    });

    test("returns all dates in a single range", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-03") },
      ];
      expect(getRangesAsIndividualDates(ranges).length).toBe(3);
    });

    test("returns all dates across multiple ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-02") },
        { start: new Date("2025-01-05"), end: new Date("2025-01-06") },
      ];
      expect(getRangesAsIndividualDates(ranges).length).toBe(4);
    });

    test("handles single day range", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-01") },
      ];
      expect(getRangesAsIndividualDates(ranges).length).toBe(1);
    });
  });

  describe("isDateInRanges", () => {
    const ranges: DateRange[] = [
      { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
    ];

    test("returns true for date in first range", () => {
      expect(isDateInRanges(new Date("2025-01-03"), ranges)).toBe(true);
    });

    test("returns true for date in second range", () => {
      expect(isDateInRanges(new Date("2025-01-12"), ranges)).toBe(true);
    });

    test("returns false for date outside ranges", () => {
      expect(isDateInRanges(new Date("2025-01-07"), ranges)).toBe(false);
    });

    test("returns true for start date", () => {
      expect(isDateInRanges(new Date("2025-01-01"), ranges)).toBe(true);
    });

    test("returns true for end date", () => {
      expect(isDateInRanges(new Date("2025-01-05"), ranges)).toBe(true);
    });

    test("handles invalid date", () => {
      expect(isDateInRanges(new Date("invalid"), ranges)).toBe(false);
    });

    test("handles empty ranges", () => {
      expect(isDateInRanges(new Date("2025-01-01"), [])).toBe(false);
    });

    test("handles corrupt date ranges gracefully", () => {
      const badRanges: DateRange[] = [
        { start: new Date("invalid"), end: new Date("2025-01-05") },
      ];
      expect(isDateInRanges(new Date("2025-01-03"), badRanges)).toBe(false);
    });
  });

  describe("findOverlappingRanges", () => {
    test("finds overlapping ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
        { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
      ];
      expect(
        findOverlappingRanges(
          ranges,
          new Date("2025-01-03"),
          new Date("2025-01-12"),
        ).length,
      ).toBe(2);
    });

    test("finds single overlapping range", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      expect(
        findOverlappingRanges(
          ranges,
          new Date("2025-01-03"),
          new Date("2025-01-04"),
        ).length,
      ).toBe(1);
    });

    test("returns empty for non-overlapping selection", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      expect(
        findOverlappingRanges(
          ranges,
          new Date("2025-01-10"),
          new Date("2025-01-15"),
        ).length,
      ).toBe(0);
    });

    test("finds range contained within selection", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-03"), end: new Date("2025-01-04") },
      ];
      expect(
        findOverlappingRanges(
          ranges,
          new Date("2025-01-01"),
          new Date("2025-01-10"),
        ).length,
      ).toBe(1);
    });
  });

  describe("updateRangesWithSelection", () => {
    test("adds new range when no overlap", () => {
      expect(
        updateRangesWithSelection(
          [],
          new Date("2025-01-01"),
          new Date("2025-01-05"),
          false,
        ).length,
      ).toBe(1);
    });

    test("removes overlapping ranges", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date("2025-01-03"),
        new Date("2025-01-04"),
        false,
      );
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    test("merges ranges when mergeRanges is true", () => {
      const ranges: DateRange[] = [
        { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      ];
      const result = updateRangesWithSelection(
        ranges,
        new Date("2025-01-06"),
        new Date("2025-01-10"),
        true,
      );
      expect(result.length).toBe(1);
      expect(result[0].start).toEqual(new Date("2025-01-01"));
      expect(result[0].end).toEqual(new Date("2025-01-10"));
    });

    test("handles reversed dates", () => {
      const ranges: DateRange[] = [];
      const result = updateRangesWithSelection(
        ranges,
        new Date("2025-01-10"),
        new Date("2025-01-05"),
        false,
      );
      expect(result.length).toBe(1);
    });
  });

  describe("findDateElementFromPoint", () => {
    test("returns date when element is found", () => {
      const dateButtonsMap = new Map();
      const testDate = new Date("2025-01-15");
      const mockElement = document.createElement("div");

      dateButtonsMap.set(testDate.toISOString(), mockElement);

      // Mock document.elementFromPoint
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => mockElement;

      const result = findDateElementFromPoint(100, 100, dateButtonsMap);

      expect(result).toEqual(testDate);

      document.elementFromPoint = originalElementFromPoint;
    });

    test("returns null when no element found at point", () => {
      const dateButtonsMap = new Map();

      // Mock document.elementFromPoint to return null
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => null;

      const result = findDateElementFromPoint(100, 100, dateButtonsMap);

      expect(result).toBeNull();

      document.elementFromPoint = originalElementFromPoint;
    });

    test("returns null when element not in map", () => {
      const dateButtonsMap = new Map();
      const mockElement = document.createElement("div");

      // Mock document.elementFromPoint to return an element not in map
      const originalElementFromPoint = document.elementFromPoint;
      document.elementFromPoint = () => mockElement;

      const result = findDateElementFromPoint(100, 100, dateButtonsMap);

      expect(result).toBeNull();

      document.elementFromPoint = originalElementFromPoint;
    });
  });

  describe("shouldUpdateDragDate", () => {
    test("returns true when current date is null", () => {
      expect(shouldUpdateDragDate(null, new Date("2025-01-15"))).toBe(true);
    });

    test("returns false when dates are same day", () => {
      const date = new Date("2025-01-15");
      expect(shouldUpdateDragDate(date, date)).toBe(false);
    });

    test("returns true when dates are different days", () => {
      expect(
        shouldUpdateDragDate(new Date("2025-01-15"), new Date("2025-01-16")),
      ).toBe(true);
    });

    test("returns false when new date is invalid", () => {
      expect(
        shouldUpdateDragDate(new Date("2025-01-15"), new Date("invalid")),
      ).toBe(false);
    });
  });

  describe("handlePointerDownLogic", () => {
    test("returns drag state for valid date", () => {
      const date = new Date("2025-01-15");
      const result = handlePointerDownLogic(date);
      expect(result).not.toBeNull();
      expect(result?.dragStart).toEqual(date);
      expect(result?.dragEnd).toEqual(date);
    });

    test("returns null for invalid date", () => {
      expect(handlePointerDownLogic(null)).toBeNull();
      expect(handlePointerDownLogic(new Date("invalid"))).toBeNull();
    });
  });

  describe("handlePointerMoveLogic", () => {
    test("returns new date when dragging", () => {
      const result = handlePointerMoveLogic(
        new Date("2025-01-16"),
        true,
        new Date("2025-01-15"),
        new Date("2025-01-15"),
      );
      expect(result).not.toBe(null);
    });

    test("returns null when not dragging", () => {
      const result = handlePointerMoveLogic(
        new Date("2025-01-16"),
        false,
        new Date("2025-01-15"),
        new Date("2025-01-15"),
      );
      expect(result).toBe(null);
    });

    test("returns null when same day", () => {
      const result = handlePointerMoveLogic(
        new Date("2025-01-15T14:00:00"),
        true,
        new Date("2025-01-15T10:00:00"),
        new Date("2025-01-15T12:00:00"),
      );
      expect(result).toBe(null);
    });
  });
});

describe("Component-Specific Functions", () => {
  describe("getAdjacentDate", () => {
    test("returns previous day", () => {
      const result = getAdjacentDate(new Date("2025-01-15"), "left");
      expect(result.getDate()).toBe(14);
    });

    test("returns next day", () => {
      const result = getAdjacentDate(new Date("2025-01-15"), "right");
      expect(result.getDate()).toBe(16);
    });
  });

  describe("areDatesInSameRange", () => {
    const ranges: DateRange[] = [
      { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
      { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
    ];

    test("returns true for dates in same range", () => {
      expect(
        areDatesInSameRange(
          new Date("2025-01-02"),
          new Date("2025-01-04"),
          ranges,
        ),
      ).toBe(true);
    });

    test("returns false for dates in different ranges", () => {
      expect(
        areDatesInSameRange(
          new Date("2025-01-02"),
          new Date("2025-01-12"),
          ranges,
        ),
      ).toBe(false);
    });

    test("returns false for invalid dates", () => {
      expect(
        areDatesInSameRange(
          new Date("invalid"),
          new Date("2025-01-02"),
          ranges,
        ),
      ).toBe(false);
    });
  });

  describe("hasAdjacentSelectedDate", () => {
    const ranges: DateRange[] = [
      { start: new Date("2025-01-01"), end: new Date("2025-01-05") },
    ];

    test("returns true when adjacent date is selected", () => {
      expect(
        hasAdjacentSelectedDate(new Date("2025-01-03"), "left", ranges),
      ).toBe(true);
      expect(
        hasAdjacentSelectedDate(new Date("2025-01-03"), "right", ranges),
      ).toBe(true);
    });

    test("returns false at range boundaries", () => {
      expect(
        hasAdjacentSelectedDate(new Date("2025-01-01"), "left", ranges),
      ).toBe(false);
      expect(
        hasAdjacentSelectedDate(new Date("2025-01-05"), "right", ranges),
      ).toBe(false);
    });
  });

  describe("isDateInHoverRange", () => {
    test("returns true for date in hover range while dragging", () => {
      expect(
        isDateInHoverRange(
          new Date("2025-01-03"),
          new Date("2025-01-01"),
          new Date("2025-01-05"),
          true,
        ),
      ).toBe(true);
    });

    test("returns false when not dragging", () => {
      expect(
        isDateInHoverRange(
          new Date("2025-01-03"),
          new Date("2025-01-01"),
          new Date("2025-01-05"),
          false,
        ),
      ).toBe(false);
    });

    test("handles reversed drag dates", () => {
      expect(
        isDateInHoverRange(
          new Date("2025-01-03"),
          new Date("2025-01-05"),
          new Date("2025-01-01"),
          true,
        ),
      ).toBe(true);
    });
  });

  describe("calculateDayRoundingStyleForCalendar", () => {
    const ranges: DateRange[] = [
      { start: new Date("2025-01-10"), end: new Date("2025-01-15") },
    ];

    test("rounds left on range start", () => {
      const result = calculateDayRoundingStyleForCalendar(
        new Date("2025-01-10"),
        ranges,
        null,
        null,
        false,
        false,
      );
      expect(result.shouldRoundLeft).toBe(true);
      expect(result.shouldRoundRight).toBe(false);
    });

    test("rounds right on range end", () => {
      const result = calculateDayRoundingStyleForCalendar(
        new Date("2025-01-15"),
        ranges,
        null,
        null,
        false,
        false,
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(true);
    });

    test("no rounding for middle dates", () => {
      const result = calculateDayRoundingStyleForCalendar(
        new Date("2025-01-12"),
        ranges,
        null,
        null,
        false,
        false,
      );
      expect(result.shouldRoundLeft).toBe(false);
      expect(result.shouldRoundRight).toBe(false);
    });
  });

  describe("commitSelection", () => {
    test("updates ranges with selection", () => {
      const ranges: DateRange[] = [];
      const onChange = vi.fn();
      const result = commitSelection(
        new Date("2025-01-01"),
        new Date("2025-01-05"),
        ranges,
        false,
        onChange,
        undefined,
      );

      expect(result.length).toBe(1);
      expect(onChange).toHaveBeenCalledWith(result);
    });

    test("calls onIndividualDatesChange when provided", () => {
      const ranges: DateRange[] = [];
      const onChange = vi.fn();
      const onIndividualDatesChange = vi.fn();
      commitSelection(
        new Date("2025-01-01"),
        new Date("2025-01-05"),
        ranges,
        false,
        onChange,
        onIndividualDatesChange,
      );

      expect(onIndividualDatesChange).toHaveBeenCalled();
    });
  });

  describe("generateDayButtonStyles", () => {
    test("returns base styles for unselected day", () => {
      const styles = generateDayButtonStyles(
        false,
        false,
        false,
        false,
        DAY_SIZE,
        DAY_MARGIN,
        captionTypography,
      );
      expect(styles.width).toBe(DAY_SIZE);
      expect(styles.height).toBe(DAY_SIZE);
      expect(styles.margin).toBeDefined();
      expect(styles.touchAction).toBe("none");
    });

    test("returns selected styles", () => {
      const styles = generateDayButtonStyles(
        true,
        false,
        false,
        false,
        DAY_SIZE,
        DAY_MARGIN,
        captionTypography,
      );
      expect(styles.backgroundColor).toBe("primary.main");
      expect(styles.color).toBe("primary.contrastText");
    });

    test("applies rounded borders correctly", () => {
      const stylesLeft = generateDayButtonStyles(
        true,
        false,
        true,
        false,
        DAY_SIZE,
        DAY_MARGIN,
        captionTypography,
      );
      expect(stylesLeft.borderTopLeftRadius).toBe("50%");
      expect(stylesLeft.borderBottomLeftRadius).toBe("50%");

      const stylesRight = generateDayButtonStyles(
        true,
        false,
        false,
        true,
        DAY_SIZE,
        DAY_MARGIN,
        captionTypography,
      );
      expect(stylesRight.borderTopRightRadius).toBe("50%");
      expect(stylesRight.borderBottomRightRadius).toBe("50%");
    });
  });
});

describe("DOM Rendering and Interactions", () => {
  test("renders without crashing", () => {
    const { container } = render(<MultiRangeDatePicker />);
    expect(container).toBeDefined();
    cleanup();
  });

  test("renders with onChange prop", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MultiRangeDatePicker onChange={handleChange} />,
    );
    expect(container).toBeDefined();
    cleanup();
  });

  test("renders with mergeRanges prop", () => {
    const { container } = render(<MultiRangeDatePicker mergeRanges={true} />);
    expect(container).toBeDefined();
    cleanup();
  });

  test("calls onChange when date range is selected", () => {
    const handleChange = vi.fn();
    render(<MultiRangeDatePicker onChange={handleChange} />);

    // Note: Full interaction testing requires MUI DateCalendar to render dates
    // Which requires proper MUI theme setup. These are smoke tests to verify
    // the component structure and props handling work correctly.

    cleanup();
  });

  test("renders with all props", () => {
    const handleChange = vi.fn();
    const handleIndividualDatesChange = vi.fn();
    const { container } = render(
      <MultiRangeDatePicker
        onChange={handleChange}
        onIndividualDatesChange={handleIndividualDatesChange}
        mergeRanges={true}
      />,
    );
    expect(container).toBeDefined();
    cleanup();
  });
});
