import type { IWeeklyGraphEntry } from "@/types/dashboard";
import { formatDateLabel, formatDuration } from "@/utils/activity-format";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { spring, progressUpdate } from "@/lib/motion";
import SkeletonBlock from "../skeleton-block";

interface WeeklyGraphCardProps {
    weeklyData: IWeeklyGraphEntry[];
    isLoading?: boolean;
}

const BAR_AREA = 120;

const WeeklyGraphCard = ({ weeklyData, isLoading }: WeeklyGraphCardProps) => {
    const maxSeconds = weeklyData.length
        ? Math.max(...weeklyData.map((d) => d.focusSeconds), 0)
        : 0;
    const totalSeconds = weeklyData.reduce((sum, d) => sum + d.focusSeconds, 0);
    const totalTasks = weeklyData.reduce((sum, d) => sum + d.tasks, 0);

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 }}
            className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
        >
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-6 py-4">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                        Weekly Activity
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-ink-faint">
                        Focus time and tasks completed per day
                    </p>
                </div>
                <div className="text-right">
                    <div className="font-mono text-sm font-bold tabular-nums text-ink">
                        {formatDuration(totalSeconds)}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                        {totalTasks} tasks done
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="px-6 pb-6 pt-14">
                    <div className="flex items-end justify-between gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonBlock key={i} className="h-24 flex-1" />
                        ))}
                    </div>
                    <div className="mt-1 h-0.5 bg-ink" />
                </div>
            ) : !weeklyData.length ? (
                <div className="px-6 pb-6 pt-6">
                    <div className="rounded-lg border-2 border-dashed border-line px-6 py-10 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                            No focus data yet
                        </p>
                        <p className="mt-1.5 text-xs font-medium text-ink-soft">
                            Run a focus session and this week will start filling in.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="px-6 pb-6 pt-16">
                    <div className="flex items-end justify-between gap-2">
                        {weeklyData.map((day, i) => {
                            const isToday = day.day === "Today";
                            const rawHeight = maxSeconds > 0 ? (day.focusSeconds / maxSeconds) * BAR_AREA : 0;
                            const heightPx = day.focusSeconds > 0 ? Math.max(rawHeight, 6) : 0;

                            return (
                                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                                    <div
                                        className="group relative flex w-full flex-col justify-end"
                                        style={{ height: BAR_AREA }}
                                    >
                                        <div
                                            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2.5 py-1.5 text-xs text-paper opacity-0 transition-opacity duration-fast group-hover:opacity-100"
                                            style={{ bottom: heightPx + 8 }}
                                        >
                                            <div className="font-bold">{formatDateLabel(day.date)}</div>
                                            <div className="mt-0.5 font-mono text-[11px] text-paper/80">
                                                Focus: {formatDuration(day.focusSeconds)}
                                            </div>
                                            <div className="font-mono text-[11px] text-paper/80">
                                                Tasks: {day.tasks}
                                            </div>
                                        </div>

                                        <motion.div
                                            className={`w-full rounded-t-lg ${
                                                isToday ? "border-2 border-ink" : ""
                                            }`}
                                            style={{
                                                background: isToday
                                                    ? "#f4a340"
                                                    : "rgba(244, 163, 64, 0.55)",
                                            }}
                                            initial={{ height: 0 }}
                                            animate={{ height: heightPx }}
                                            transition={{ ...progressUpdate, delay: i * 0.05 }}
                                        />
                                    </div>

                                    <span
                                        className={`text-[11px] font-bold ${
                                            isToday ? "text-ink" : "text-ink-soft"
                                        }`}
                                    >
                                        {day.day}
                                    </span>
                                    <span
                                        className={`flex items-center gap-1 text-[10px] font-bold ${
                                            day.tasks > 0 ? "text-progress-deep" : "text-ink-faint"
                                        }`}
                                    >
                                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                        {day.tasks}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Baseline axis */}
                    <div className="mt-0 h-0.5 bg-ink" />

                    <div className="mt-1.5 flex justify-between px-1 font-mono text-[10px] tabular-nums text-ink-faint">
                        <span>0m</span>
                        <span>{formatDuration(maxSeconds / 2)}</span>
                        <span>{formatDuration(maxSeconds)}</span>
                    </div>
                </div>
            )}
        </motion.section>
    );
};

export default WeeklyGraphCard;