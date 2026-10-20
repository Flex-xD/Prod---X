import type { ICalendarCell } from '../collections-row/collections-row-types';

// Matches the shared CalendarCard that activity-calendar re-exports.
export interface IActivityCalendarProps {
    calendarData: ICalendarCell[][];
    isLoading?: boolean;
}
