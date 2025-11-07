import "../test-utils/setup";
import { describe, test, expect } from "bun:test";
import type { DateRange, MultiRangeDatePickerProps } from "./types";

// Note: TypeScript validates types at compile time.
// These tests just verify types are exported and usable at runtime.

describe("Type Exports", () => {
  test("DateRange type is usable", () => {
    const range: DateRange = {
      start: new Date("2025-01-01"),
      end: new Date("2025-01-05"),
    };

    expect(range.start).toBeInstanceOf(Date);
    expect(range.end).toBeInstanceOf(Date);
  });

  test("MultiRangeDatePickerProps type is usable", () => {
    const props: MultiRangeDatePickerProps = {
      onChange: (ranges: DateRange[]) => {},
      onIndividualDatesChange: (dates: Date[]) => {},
      mergeRanges: true,
    };

    expect(typeof props.onChange).toBe("function");
    expect(typeof props.mergeRanges).toBe("boolean");
  });
});
