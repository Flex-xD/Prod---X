import type { IProfileStats } from '@/types/user';

export type CalendarIntensity = 'none' | 'low' | 'medium' | 'high';

export interface ICalendarCell {
    intensity: CalendarIntensity;
    hours: number;
    date: string;
}

export interface ICollection {
    label: string;
    value: number;
    iconName: 'CheckSquare' | 'Timer' | 'Users';
    tone: 'ink' | 'focus' | 'progress';
}

export interface ICollectionsRowProps {
    collections: ICollection[];
}

export interface ICategoryBreakdownProps {
    stats: IProfileStats;
}
