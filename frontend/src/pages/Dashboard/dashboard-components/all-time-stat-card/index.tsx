import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { spring } from '@/lib/motion';
import SkeletonBlock from '../skeleton-block';
import useGetProfileData from '@/custom-hooks/profile/get-profile-data';

interface AllTimeStatCardProps {
    delay?: number;
}

const formatHours = (seconds: number) => (seconds / 3600).toFixed(1);

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <span className="flex items-center justify-between gap-2">
        <span className="truncate font-semibold text-ink-faint">{label}</span>
        <span className="flex-shrink-0 font-mono font-bold tabular-nums text-ink-soft">{value}</span>
    </span>
);

/**
 * All-time stat cell for the dashboard strip:
 * tasks done/undone across history + every individual and group timer with
 * their separate productivity totals. Fed by the profile aggregation endpoint
 * (the same data the profile page shows), so the two pages never disagree.
 */
const AllTimeStatCard = ({ delay = 0 }: AllTimeStatCardProps) => {
    const { data: profile, isLoading } = useGetProfileData();
    const stats = profile?.data?.stats;

    const allTime = stats?.allTimeTasks;
    const soloCount = stats
        ? stats.individualTimers.active + stats.individualTimers.completed + stats.individualTimers.expired
        : 0;
    const groupCount = stats
        ? stats.groupTimers.active + stats.groupTimers.completed + stats.groupTimers.expired
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: delay + 0.15 }}
            className="flex flex-col gap-2 p-5 lg:p-6"
        >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                All Time
            </span>

            {isLoading || !stats ? (
                <div className="flex flex-col gap-2.5 pt-0.5">
                    <SkeletonBlock className="h-7 w-24" />
                    <SkeletonBlock className="h-3 w-32" />
                    <SkeletonBlock className="h-3 w-28" />
                </div>
            ) : (
                <>
                    <span className="font-mono text-3xl font-bold leading-none tabular-nums text-ink lg:text-4xl">
                        {allTime ? allTime.done : '—'}
                        <span className="text-2xl">/{allTime ? allTime.total : '—'}</span>
                    </span>
                    <span className="flex min-h-5 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                        {allTime ? `${allTime.pending} undone · tasks done` : 'tasks done'}
                    </span>

                    <span className="mt-1 flex flex-col gap-1.5 border-t-2 border-line pt-2.5 text-[11px] font-semibold uppercase tracking-wider">
                        <Row
                            label="Solo timers"
                            value={`${soloCount} · ${formatHours(stats.individualTimers.totalFocusSeconds)}h`}
                        />
                        <Row
                            label="Group timers"
                            value={`${groupCount} · ${formatHours(stats.groupTimers.totalFocusSeconds)}h`}
                        />
                    </span>
                </>
            )}
        </motion.div>
    );
};

export default AllTimeStatCard;
