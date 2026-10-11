import type { IWeeklyGraphEntry } from "@/types/dashboard";
import { formatDateLabel, formatDuration } from "@/utils/activity-format";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface WeeklyGraphCardProps {
    weeklyData: IWeeklyGraphEntry[];
}

const BAR_AREA = 120;

const WeeklyGraphCard = ({ weeklyData }: WeeklyGraphCardProps) => {
    const maxSeconds = Math.max(...weeklyData.map((d) => d.focusSeconds), 0);
    const totalSeconds = weeklyData.reduce((sum, d) => sum + d.focusSeconds, 0);
    const totalTasks = weeklyData.reduce((sum, d) => sum + d.tasks, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", damping: 28, stiffness: 280 }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
            <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                <div>
                    <h3 className="font-black text-slate-900 text-base">Weekly Activity</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Focus time and tasks completed per day</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-black text-violet-600">{formatDuration(totalSeconds)}</div>
                    <div className="text-xs font-semibold text-slate-400">{totalTasks} tasks done</div>
                </div>
            </div>

            <div className="px-6 pb-6 pt-16">
                <div className="flex items-end justify-between gap-2">
                    {weeklyData.map((day, i) => {
                        const isToday = day.day === "Today";
                        const rawHeight = maxSeconds > 0 ? (day.focusSeconds / maxSeconds) * BAR_AREA : 0;
                        const heightPx = day.focusSeconds > 0 ? Math.max(rawHeight, 6) : 0;

                        return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                                <div
                                    className="relative w-full group flex flex-col justify-end"
                                    style={{ height: BAR_AREA }}
                                >
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
                                        style={{ bottom: heightPx + 8, background: "#1e293b", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                                    >
                                        <div>{formatDateLabel(day.date)}</div>
                                        <div className="font-semibold text-slate-300 mt-0.5">
                                            Focus: {formatDuration(day.focusSeconds)}
                                        </div>
                                        <div className="font-semibold text-slate-300">Tasks done: {day.tasks}</div>
                                    </div>
                                    <motion.div
                                        className="w-full rounded-t-2xl"
                                        style={{
                                            background: isToday
                                                ? "linear-gradient(180deg, #7C3AED, #4F46E5)"
                                                : "linear-gradient(180deg, #c4b5fd, #a78bfa)",
                                            boxShadow: isToday ? "0 -4px 16px rgba(124,58,237,0.35)" : "none",
                                        }}
                                        initial={{ height: 0 }}
                                        animate={{ height: heightPx }}
                                        transition={{ delay: i * 0.07, duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
                                    />
                                </div>
                                <span className="text-xs font-bold" style={{ color: isToday ? "#7c3aed" : "#94a3b8" }}>
                                    {day.day}
                                </span>
                                <span
                                    className="flex items-center gap-1 text-[11px] font-bold"
                                    style={{ color: day.tasks > 0 ? "#10b981" : "#cbd5e1" }}
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {day.tasks}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mt-3 px-1">
                    <span>0m</span>
                    <span>{formatDuration(maxSeconds / 2)}</span>
                    <span>{formatDuration(maxSeconds)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default WeeklyGraphCard;