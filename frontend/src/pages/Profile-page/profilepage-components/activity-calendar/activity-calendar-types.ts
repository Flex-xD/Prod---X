import type { ICalendarCell } from '../collections-row/collections-row-types';

export interface IActivityCalendarProps {
    data: ICalendarCell[][];
    totalHours: number;
}