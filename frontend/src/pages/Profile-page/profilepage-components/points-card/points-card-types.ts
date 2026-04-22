export interface IPointsBreakdown {
    label: string;
    points: number;
    iconName: 'CheckSquare' | 'Clock' | 'Users';
    color: string;
    pct: number;
}

export interface IPointsCardProps {
    totalPoints: number;
    rank: number;
    breakdown: IPointsBreakdown[];
}