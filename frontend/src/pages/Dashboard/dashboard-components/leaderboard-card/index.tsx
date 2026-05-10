import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Star, ChevronRight } from 'lucide-react';

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

const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

const RANK_CONFIG = [
    { icon: Crown, bg: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)' },
    { icon: Medal, bg: 'linear-gradient(135deg,#94a3b8,#64748b)', shadow: 'rgba(100,116,139,0.25)' },
    { icon: Star, bg: 'linear-gradient(135deg,#f97316,#ea580c)', shadow: 'rgba(249,115,22,0.3)' },
];

// Stable avatar gradient for each position
const AVATAR_GRADS = [
    'linear-gradient(135deg,#7C3AED,#4F46E5)',
    'linear-gradient(135deg,#EC4899,#F43F5E)',
    'linear-gradient(135deg,#10B981,#0D9488)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
];

const LeaderboardCard = ({ leaderboard }: LeaderboardCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ...sp }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            {/* Header */}
            <div
                className="px-5 pt-5 pb-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
            >
                <div>
                    <h3 className="font-black text-slate-900 text-base">Leaderboard</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">This week's top performers</p>
                </div>
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: '#fefce8', border: '1px solid #fde68a' }}
                >
                    <Trophy className="w-4.5 h-4.5 w-[18px] h-[18px] text-amber-500" />
                </div>
            </div>

            {/* Rows */}
            <div className="p-3 space-y-1.5">
                {leaderboard.map((user, i) => {
                    const rank = RANK_CONFIG[i];
                    const RankIcon = rank?.icon ?? Star;

                    return (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07, ...sp }}
                            className="p-3.5 rounded-2xl flex items-center gap-3 transition-all"
                            style={{
                                background: user.isYou
                                    ? 'linear-gradient(135deg,#f5f3ff,#ede9fe)'
                                    : '#f8fafc',
                                border: user.isYou ? '1.5px solid #ddd6fe' : '1.5px solid transparent',
                            }}
                        >
                            {/* Rank badge */}
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: rank?.bg ?? 'linear-gradient(135deg,#cbd5e1,#94a3b8)',
                                    boxShadow: rank ? `0 4px 10px ${rank.shadow}` : 'none',
                                }}
                            >
                                <RankIcon className="w-3.5 h-3.5 text-white" />
                            </div>

                            {/* Avatar */}
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                style={{ background: AVATAR_GRADS[i % AVATAR_GRADS.length] }}
                            >
                                {user.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-slate-900 text-sm truncate">{user.name}</span>
                                    {user.isYou && (
                                        <span
                                            className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                            style={{ background: '#ede9fe', color: '#7c3aed' }}
                                        >
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">{user.score} pts</p>
                            </div>

                            {/* Score accent for rank 1 */}
                            {user.rank === 1 && (
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                                >
                                    <Star className="w-4 h-4 text-amber-400" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}

                {/* CTA */}
                <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{ color: '#7c3aed' }}
                >
                    View Full Leaderboard <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LeaderboardCard;