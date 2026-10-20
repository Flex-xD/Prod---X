import type { IProfileStats } from '@/types/user';

export interface IFocusSummaryCardProps {
    stats: IProfileStats;
}

export interface IPointsBreakdown {
    label: string;
    points: number;
    iconName: 'CheckSquare' | 'Clock' | 'Users';
    tone: 'ink' | 'focus' | 'progress';
    pct: number;
}
