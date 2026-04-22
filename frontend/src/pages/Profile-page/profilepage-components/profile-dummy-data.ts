import type { ICalendarCell, ICollection } from './collections-row/collections-row-types';
import type { IPointsBreakdown } from './points-card/points-card-types';

export const generateYearCalendarData = (): ICalendarCell[][] => {
    const data: ICalendarCell[][] = [];
    for (let week = 0; week < 53; week++) {
        const weekData: ICalendarCell[] = [];
        for (let day = 0; day < 7; day++) {
            const r = Math.random();
            weekData.push({
                intensity: r > 0.75 ? 'high' : r > 0.5 ? 'medium' : r > 0.3 ? 'low' : 'none',
                hours: r > 0.3 ? Math.floor(Math.random() * 6) + 1 : 0,
                date: '', // wire up real dates in production
            });
        }
        data.push(weekData);
    }
    return data;
};


export const collectionsData: ICollection[] = [
    {
        label: 'Tasks Done',
        value: 138,
        iconName: 'CheckSquare',
        gradient: 'from-green-400 to-emerald-500',
        iconBg: 'bg-green-100 text-green-600',
    },
    {
        label: 'Focus Sessions',
        value: 92,
        iconName: 'Timer',
        gradient: 'from-blue-400 to-indigo-500',
        iconBg: 'bg-blue-100 text-blue-600',
    },
    {
        label: 'Group Sessions',
        value: 31,
        iconName: 'Users',
        gradient: 'from-purple-400 to-violet-500',
        iconBg: 'bg-purple-100 text-purple-600',
    },
];


export const pointsBreakdown: IPointsBreakdown[] = [
    { label: 'Tasks Completed', points: 2760, iconName: 'CheckSquare', color: 'bg-green-500', pct: 60 },
    { label: 'Focus Sessions', points: 1380, iconName: 'Clock', color: 'bg-blue-500', pct: 30 },
    { label: 'Group Sessions', points: 680, iconName: 'Users', color: 'bg-purple-500', pct: 15 },
];