import type { ICalendarCell, ICollection } from './collections-row/collections-row-types';
import type { IPointsBreakdown } from './points-card/points-card-types';

// ─── Calendar ─────────────────────────────────────────────────────────────────

export const generateYearCalendarData = (): ICalendarCell[][] => {
    const data: ICalendarCell[][] = [];
    for (let week = 0; week < 53; week++) {
        const weekData: ICalendarCell[] = [];
        for (let day = 0; day < 7; day++) {
            const r = Math.random();
            weekData.push({
                intensity: r > 0.75 ? 'high' : r > 0.5 ? 'medium' : r > 0.3 ? 'low' : 'none',
                hours: r > 0.3 ? Math.floor(Math.random() * 6) + 1 : 0,
                date: '',
            });
        }
        data.push(weekData);
    }
    return data;
};

// ─── Collections ──────────────────────────────────────────────────────────────

export const collectionsData: ICollection[] = [
    {
        label: 'Tasks Done',
        value: 138,
        iconName: 'CheckSquare',
        tone: 'progress',
    },
    {
        label: 'Focus Sessions',
        value: 92,
        iconName: 'Timer',
        tone: 'focus',
    },
    {
        label: 'Group Sessions',
        value: 31,
        iconName: 'Users',
        tone: 'ink',
    },
];

// ─── Points breakdown ─────────────────────────────────────────────────────────

export const pointsBreakdown: IPointsBreakdown[] = [
    { label: 'Tasks Completed', points: 2760, iconName: 'CheckSquare', tone: 'progress', pct: 60 },
    { label: 'Focus Sessions', points: 1380, iconName: 'Clock', tone: 'focus', pct: 30 },
    { label: 'Group Sessions', points: 680, iconName: 'Users', tone: 'ink', pct: 15 },
];