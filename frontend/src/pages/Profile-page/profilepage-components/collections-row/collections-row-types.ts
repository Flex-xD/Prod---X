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
    gradient: string;
    iconBg: string;
}

export interface ICollectionsRowProps {
    collections: ICollection[];
}