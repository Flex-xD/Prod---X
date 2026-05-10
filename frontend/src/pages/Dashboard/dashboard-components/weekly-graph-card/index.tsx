import { motion } from 'framer-motion';

interface WeeklyData {
    day: string;
    tasks: number;
    hours: number;
}

interface WeeklyGraphCardProps {
    weeklyData: WeeklyData[];
    maxHours: number;
}

const sp = { type: 'spring', damping: 28, stiffness: 280 } as const;

const WeeklyGraphCard = ({ weeklyData, maxHours }: WeeklyGraphCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ...sp }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                <div>
                    <h3 className="font-black text-slate-900 text-base">Weekly Progress</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Hours focused this week</p>
                </div>
                {/* Total hours pill */}
                <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}
                >
                    {weeklyData.reduce((s, d) => s + d.hours, 0)}h total
                </span>
            </div>

            <div className="px-6 pb-6 pt-4">
                {/* Bar chart */}
                <div className="flex items-end justify-between gap-2 h-44">
                    {weeklyData.map((day, i) => {
                        const heightPx = maxHours > 0 ? (day.hours / maxHours) * 160 : 0;
                        const isToday = day.day === 'Today';

                        return (
                            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                {/* Bar wrapper — enables hover tooltip */}
                                <div className="relative w-full group flex flex-col justify-end" style={{ height: 164 }}>
                                    {/* Tooltip */}
                                    <div
                                        className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap
                                opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200"
                                        style={{ background: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                                    >
                                        {day.hours}h · {day.tasks} tasks
                                    </div>

                                    {/* Bar */}
                                    <motion.div
                                        className="w-full rounded-t-2xl"
                                        style={{
                                            background: isToday
                                                ? 'linear-gradient(180deg, #7C3AED, #4F46E5)'
                                                : 'linear-gradient(180deg, #c4b5fd, #a78bfa)',
                                            boxShadow: isToday ? '0 -4px 16px rgba(124,58,237,0.35)' : 'none',
                                        }}
                                        initial={{ height: 0 }}
                                        animate={{ height: heightPx }}
                                        transition={{ delay: i * 0.07, duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
                                    />
                                </div>

                                {/* Day label */}
                                <span
                                    className="text-xs font-bold"
                                    style={{ color: isToday ? '#7c3aed' : '#94a3b8' }}
                                >
                                    {day.day}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Y-axis hint */}
                <div className="flex justify-between text-xs font-semibold text-slate-300 mt-3 px-1">
                    <span>0h</span>
                    <span>{Math.round(maxHours / 2)}h</span>
                    <span>{maxHours}h</span>
                </div>
            </div>
        </motion.div>
    );
};

export default WeeklyGraphCard;