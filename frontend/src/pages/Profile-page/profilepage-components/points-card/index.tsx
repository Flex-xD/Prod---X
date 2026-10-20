import { motion } from 'framer-motion';
import { Clock, Timer, Users, Flame } from 'lucide-react';
import type { IFocusSummaryCardProps } from './points-card-types';
import { enter } from '@/lib/motion';

const formatHours = (seconds: number) => (seconds / 3600).toFixed(1);

// Tile color earns its place: focus orange = focus time (chart-2's
// mapping), progress green = the streak record, ink = plain session
// counts - the same neutral treatment as the dashboard stat strip.
const FocusSummaryCard = ({ stats }: IFocusSummaryCardProps) => {
    const totalFocusSeconds =
        stats.individualTimers.totalFocusSeconds + stats.groupTimers.totalFocusSeconds;

    const items = [
        {
            icon: Clock,
            label: 'Total Focus Time',
            value: `${formatHours(totalFocusSeconds)}h`,
            tile: 'bg-focus',
            iconCls: 'text-ink',
        },
        {
            icon: Timer,
            label: 'Individual Sessions',
            value: `${stats.individualTimers.completed + stats.individualTimers.active}`,
            tile: 'bg-ink',
            iconCls: 'text-paper',
        },
        {
            icon: Users,
            label: 'Group Sessions',
            value: `${stats.groupTimers.completed + stats.groupTimers.active}`,
            tile: 'bg-ink',
            iconCls: 'text-paper',
        },
        {
            icon: Flame,
            label: 'Longest Streak',
            value: `${stats.streakData.longestStreak}d`,
            tile: 'bg-progress',
            iconCls: 'text-ink',
        },
    ];

    return (
        <motion.section
            {...enter(0.06)}
            aria-label="Focus summary"
            className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard"
        >
            <div className="border-b-2 border-ink px-5 py-3.5">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                    Focus Summary
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-ink-faint">
                    Time and sessions, all time
                </p>
            </div>

            {/* One arrival per section: the card arrives as a whole instead of
                staggering every tile. */}
            <div className="grid grid-cols-2 gap-4 p-5">
                {items.map(({ icon: Icon, label, value, tile, iconCls }) => (
                    <div key={label} className="rounded-lg border border-line bg-paper p-4">
                        <span
                            aria-hidden="true"
                            className={`mb-3 flex h-9 w-9 items-center justify-center rounded-sm border-2 border-ink ${tile}`}
                        >
                            <Icon className={`h-4 w-4 ${iconCls}`} />
                        </span>
                        <div className="font-mono text-xl font-bold leading-none tabular-nums text-ink">
                            {value}
                        </div>
                        <div className="mt-1.5 text-xs font-medium text-ink-soft">{label}</div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default FocusSummaryCard;
