import { motion } from 'framer-motion';
import { Clock, Timer, Users, Flame } from 'lucide-react';
import type { IProfileStats } from '@/types/user';

interface FocusSummaryCardProps {
    stats: IProfileStats;
}

const formatHours = (seconds: number) => (seconds / 3600).toFixed(1);

const FocusSummaryCard = ({ stats }: FocusSummaryCardProps) => {
    const totalFocusSeconds = stats.individualTimers.totalFocusSeconds + stats.groupTimers.totalFocusSeconds;

    const items = [
        { icon: Clock, label: 'Total Focus Time', value: `${formatHours(totalFocusSeconds)}h`, color: '#7C3AED' },
        { icon: Timer, label: 'Individual Sessions', value: `${stats.individualTimers.completed + stats.individualTimers.active}`, color: '#3B82F6' },
        { icon: Users, label: 'Group Sessions', value: `${stats.groupTimers.completed + stats.groupTimers.active}`, color: '#EC4899' },
        { icon: Flame, label: 'Longest Streak', value: `${stats.streakData.longestStreak}d`, color: '#F97316' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, type: 'spring', damping: 28, stiffness: 280 }}
            className="rounded-3xl bg-white p-6"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            <h3 className="font-black text-slate-900 text-base mb-5">Focus Summary</h3>

            <div className="grid grid-cols-2 gap-4">
                {items.map(({ icon: Icon, label, value, color }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="p-4 rounded-2xl" style={{ background: '#f8fafc' }}
                    >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
                            <Icon className="w-4.5 h-4.5" style={{ color }} />
                        </div>
                        <div className="text-xl font-black text-slate-900">{value}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{label}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default FocusSummaryCard;