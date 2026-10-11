import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { formatDateLabel, formatDuration } from "@/utils/activity-format";

type Intensity = "high" | "medium" | "low" | "none";

interface CalendarCell {
    date: string;
    intensity: Intensity;
    hours: number;
    focusSeconds?: number;
    tasks?: number;
}

interface CalendarCardProps {
    calendarData: CalendarCell[][];
}

interface TooltipState {
    x: number;
    y: number;
    below: boolean;
    cell: CalendarCell;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const STEP = 14;
const LABEL_COLUMN = 30;
const TOOLTIP_HALF_WIDTH = 80;

const INTENSITY_STYLE: Record<Intensity, React.CSSProperties> = {
    high: { background: "#7C3AED", boxShadow: "0 0 6px rgba(124,58,237,0.45)" },
    medium: { background: "#a78bfa" },
    low: { background: "#ddd6fe" },
    none: { background: "#f1f5f9" },
};

const CalendarCard = ({ calendarData }: CalendarCardProps) => {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const weeks = useMemo(() => {
        const flat = calendarData.flat();
        if (!flat.length) return [] as (CalendarCell | null)[][];
        const lead = new Date(`${flat[0].date}T00:00:00Z`).getUTCDay();
        const padded: (CalendarCell | null)[] = [...Array.from({ length: lead }, () => null), ...flat];
        const result: (CalendarCell | null)[][] = [];
        for (let i = 0; i < padded.length; i += 7) {
            const week = padded.slice(i, i + 7);
            while (week.length < 7) week.push(null);
            result.push(week);
        }
        return result;
    }, [calendarData]);

    const monthMarks = useMemo(() => {
        const marks: { label: string; weekIdx: number }[] = [];
        let last = -1;
        weeks.forEach((week, weekIdx) => {
            const first = week.find((c) => c !== null);
            if (!first) return;
            const month = Number(first.date.slice(5, 7)) - 1;
            if (month !== last) {
                marks.push({ label: MONTH_LABELS[month], weekIdx });
                last = month;
            }
        });
        return marks;
    }, [weeks]);

    const handleCellEnter = (e: React.MouseEvent, cell: CalendarCell, dayIdx: number) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const parent = containerRef.current?.getBoundingClientRect();
        if (!parent) return;
        const rawX = rect.left - parent.left + rect.width / 2;
        const x = Math.min(Math.max(rawX, TOOLTIP_HALF_WIDTH), Math.max(parent.width - TOOLTIP_HALF_WIDTH, TOOLTIP_HALF_WIDTH));
        const below = dayIdx < 4;
        const y = below ? rect.bottom - parent.top + 6 : rect.top - parent.top - 6;
        setTooltip({ x, y, below, cell });
    };

    const year = weeks.length
        ? weeks.flat().find((c) => c !== null)?.date.slice(0, 4) ?? String(new Date().getFullYear())
        : String(new Date().getFullYear());

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring", damping: 28, stiffness: 280 }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                <div>
                    <h3 className="font-black text-slate-900 text-base">Activity Calendar</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Your full-year productivity heatmap</p>
                </div>
                <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}
                >
                    {year}
                </span>
            </div>

            <div className="px-5 pb-6 overflow-x-auto">
                <div
                    ref={containerRef}
                    className="relative pb-2"
                    style={{ minWidth: LABEL_COLUMN + weeks.length * STEP }}
                >
                    <div className="relative h-4 mb-1.5" style={{ marginLeft: LABEL_COLUMN }}>
                        {monthMarks.map(({ label, weekIdx }) => (
                            <div
                                key={`${label}-${weekIdx}`}
                                className="absolute text-xs font-bold text-slate-400"
                                style={{ left: weekIdx * STEP }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <div className="flex flex-col gap-[3px] mr-1.5 flex-shrink-0">
                            {DAY_LABELS.map((d, i) => (
                                <div key={i} className="w-6 h-[11px] flex items-center justify-end">
                                    <span className="text-[9px] font-semibold text-slate-300">{d}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-[3px]">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((cell, di) =>
                                        cell ? (
                                            <motion.div
                                                key={cell.date}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: (wi * 7 + di) * 0.0015, duration: 0.2 }}
                                                whileHover={{ scale: 1.5, zIndex: 10 }}
                                                className="w-[11px] h-[11px] rounded-sm cursor-pointer relative"
                                                style={INTENSITY_STYLE[cell.intensity]}
                                                onMouseEnter={(e) => handleCellEnter(e, cell, di)}
                                                onMouseLeave={() => setTooltip(null)}
                                            />
                                        ) : (
                                            <div key={`empty-${wi}-${di}`} className="w-[11px] h-[11px]" />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {tooltip && (
                        <div
                            className="absolute z-20 pointer-events-none px-3 py-2 rounded-lg text-xs font-bold text-white whitespace-nowrap -translate-x-1/2"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: tooltip.below ? "translateX(-50%)" : "translate(-50%, -100%)",
                                background: "#1e293b",
                                boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
                            }}
                        >
                            <div>{formatDateLabel(tooltip.cell.date)}</div>
                            <div className="font-semibold text-slate-300 mt-0.5">
                                Focus time: {formatDuration(tooltip.cell.focusSeconds ?? Math.round(tooltip.cell.hours * 3600))}
                            </div>
                            <div className="font-semibold text-slate-300">Tasks done: {tooltip.cell.tasks ?? 0}</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-400">
                    <span>Less</span>
                    <div className="flex gap-1.5 items-center">
                        {(["none", "low", "medium", "high"] as Intensity[]).map((intensity) => (
                            <div key={intensity} className="w-3 h-3 rounded-sm" style={INTENSITY_STYLE[intensity]} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarCard;