// Range utilities
export {
  mergeOverlappingRanges,
  findOverlappingRanges,
  getRangesAsIndividualDates,
  updateRangesWithSelection,
  type DateRange,
} from "./range-utils";

// Date utilities
export {
  isDateInRanges,
  shouldUpdateDragDate,
  findDateElementFromPoint,
} from "./date-utils";

// Pointer utilities
export {
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from "./pointer-utils";
