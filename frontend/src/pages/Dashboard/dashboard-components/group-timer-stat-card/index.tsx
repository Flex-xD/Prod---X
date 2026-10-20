import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { IDashboardSummary } from '@/types/dashboard';
import { spring, progressUpdate } from '@/lib/motion';

interface GroupTimerStatCardProps {
    data: IDashboardSummary['latestGroupTimer'];
    delay?: number;
}

const GroupTimerStatCard = ({ data, delay = 0 }: GroupTimerStatCardProps) => {
    if (!data) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: delay + 0.15 }}
                className="flex flex-col gap-2 p-5 lg:p-6"
            >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                    Group Session
                </span>
                <span className="font-mono text-3xl font-bold leading-none text-ink-faint lg:text-4xl">
                    None
                </span>
                <span className="min-h-5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    <Link
                        to="/timer"
                        className="font-bold text-ink underline decoration-2 underline-offset-2 transition-colors duration-fast hover:text-progress-deep"
                    >
                        Create one
                    </Link>
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: delay + 0.15 }}
            className="flex flex-col gap-2 p-5 lg:p-6"
        >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                Group Session
            </span>
            <span className="font-mono text-3xl font-bold leading-none tabular-nums text-ink lg:text-4xl">
                {data.progressPct}
                <span className="text-base">%</span>
            </span>

            <span className="flex min-h-5 flex-col gap-1.5">
                <span className="block h-1.5 w-full overflow-hidden rounded-sm bg-paper-deep">
                    <motion.span
                        className="block h-full rounded-sm bg-progress"
                        initial={{ width: 0 }}
                        animate={{ width: `${data.progressPct}%` }}
                        transition={{ ...progressUpdate, delay: delay + 0.3 }}
                    />
                </span>
                <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                    {data.participantCount} member{data.participantCount !== 1 ? 's' : ''} · {data.title}
                </span>
            </span>
        </motion.div >
    );
};

export default GroupTimerStatCard;