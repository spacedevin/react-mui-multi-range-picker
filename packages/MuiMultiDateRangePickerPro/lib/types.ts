export interface DateRange {
  start: Date;
  end: Date;
}

export interface MultiRangeDatePickerProps {
  onChange?: (ranges: DateRange[]) => void;
  onIndividualDatesChange?: (dates: Date[]) => void;
  mergeRanges?: boolean;
  returnIndividualDates?: boolean;
}
