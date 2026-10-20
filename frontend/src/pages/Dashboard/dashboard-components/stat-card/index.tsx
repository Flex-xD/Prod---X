// frontend/src/pages/Dashboard/dashboard-components/stat-card/index.tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { IDashboardSummary } from '@/types/dashboard';
import { spring } from '@/lib/motion';
import GroupTimerStatCard from '../group-timer-stat-card';
import SkeletonBlock from '../skeleton-block';

interface ProgressStripProps {
    summary?: IDashboardSummary;
    isLoading: boolean;
}

const formatFocusHours = (seconds: number): string => (seconds / 3600).toFixed(1);

const Cell = ({
    label,
    value,
    foot,
    delay,
}: {
    label: string;
    value: ReactNode;
    foot: ReactNode;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay }}
        className="flex flex-col gap-2 p-5 lg:p-6"
    >
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            {label}
        </span>
        <span className="font-mono text-3xl font-bold leading-none tabular-nums text-ink lg:text-4xl">
            {value}
        </span>
        <span className="flex min-h-5 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            {foot}
        </span>
    </motion.div>
);

const CellSkeleton = () => (
    <div className="flex flex-col gap-3 p-5 lg:p-6">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-8 w-24" />
        <SkeletonBlock className="h-3 w-16" />
    </div>
);

const ProgressStrip = ({ summary, isLoading }: ProgressStripProps) => {
    const tasksCompleted = summary?.data.tasksToday.completed ?? 0;
    const tasksCreated = summary?.data.tasksToday.created ?? 0;
    const streak = summary?.data.streak.current ?? 0;
    const focusHours = formatFocusHours(summary?.data.weeklyFocusSeconds ?? 0);
    const streakDays = Math.min(streak, 14);

    return (
        <>
            <div className="mb-3 flex items-end justify-between gap-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">
                    Today's Progress
                </h2>
                <p className="font-mono text-xs text-ink-faint">
                    {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </div>

            <div className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard">
                <div className="grid grid-cols-1 divide-y-2 divide-line lg:grid-cols-4 lg:divide-x-2 lg:divide-y-0">
                    {isLoading ? (
                        <>
                            <CellSkeleton />
                            <CellSkeleton />
                            <CellSkeleton />
                            <CellSkeleton />
                        </>
                    ) : (
                        <>
                            <Cell
                                label="Tasks"
                                value={
                                    <>
                                        {tasksCompleted}
                                        <span className="text-2xl">/{tasksCreated}</span>
                                    </>
                                }
                                foot="Completed today"
                                delay={0}
                            />

                            <Cell
                                label="Current Streak"
                                value={
                                    <>
                                        {streak}
                                        <span className="text-base"> DAYS</span>
                                    </>
                                }
                                foot={
                                    streak > 0 ? (
                                        <span aria-hidden="true" className="flex items-center gap-1">
                                            {Array.from({ length: streakDays }).map((_, i) => (
                                                <span key={i} className="h-2 w-2 rounded-sm bg-progress" />
                                            ))}
                                        </span>
                                    ) : (
                                        'Start today'
                                    )
                                }
                                delay={0.05}
                            />

                            <Cell
                                label="Focus Time"
                                value={
                                    <>
                                        {focusHours}
                                        <span className="text-base">h</span>
                                    </>
                                }
                                foot="This week"
                                delay={0.1}
                            />

                            <GroupTimerStatCard data={summary?.data.latestGroupTimer ?? null} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProgressStrip;