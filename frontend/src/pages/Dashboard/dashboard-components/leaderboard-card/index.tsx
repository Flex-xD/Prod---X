import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { spring, quick } from '@/lib/motion';

interface LeaderboardItem {
    rank: number;
    name: string;
    score: number;
    avatar: string;
    isYou: boolean;
}

interface LeaderboardCardProps {
    leaderboard: LeaderboardItem[];
}

// Ranking as measurement, not game: mono rank numbers and scores,
// no medals, crowns, wobbles or confetti colors.
const LeaderboardCard = ({ leaderboard }: LeaderboardCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
    >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3.5">
            <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Leaderboard</h2>
                <p className="mt-0.5 text-[11px] font-medium text-ink-faint">
                    Ranked by focus this week
                </p>
            </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-line px-5">
            {leaderboard.map((user, i) => (
                <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...quick, delay: i * 0.05 }}
                    className="flex items-center gap-3 py-3"
                >
                    <span className="w-5 flex-shrink-0 font-mono text-sm font-bold tabular-nums text-ink-faint">
                        {String(user.rank).padStart(2, '0')}
                    </span>

                    <span
                        aria-hidden="true"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper text-[10px] font-bold text-ink"
                    >
                        {user.avatar}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span
                            className={`block truncate text-sm text-ink ${
                                user.isYou ? 'font-bold' : 'font-semibold'
                            }`}
                        >
                            {user.name}
                        </span>
                    </span>

                    {user.isYou && (
                        <span className="flex-shrink-0 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper">
                            You
                        </span>
                    )}

                    <span className="flex-shrink-0 font-mono text-sm font-bold tabular-nums text-ink">
                        {user.score}
                        <span className="ml-0.5 text-[10px] font-semibold text-ink-faint">pts</span>
                    </span>
                </motion.div>
            ))}
        </div>

        {/* CTA */}
        <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 border-t-2 border-ink py-3 text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-fast hover:bg-paper-deep"
        >
            View full leaderboard
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
    </motion.div>
);

export default LeaderboardCard;