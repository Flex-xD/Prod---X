import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateLabel, formatDuration } from "@/utils/activity-format";
import { spring, quick } from "@/lib/motion";
import SkeletonBlock from "../skeleton-block";

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
    isLoading?: boolean;
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

// Heat ramp is progress green only: accumulated focus = accumulated progress.
// No glow, no purple: the calendar must read as a printed record.
const INTENSITY_STYLE: Record<Intensity, React.CSSProperties> = {
    high: { background: "#a8d95b" },
    medium: { background: "rgba(168, 217, 91, 0.65)" },
    low: { background: "rgba(168, 217, 91, 0.3)" },
    none: { background: "#e9e2d1" },
};

const CalendarCard = ({ calendarData, isLoading }: CalendarCardProps) => {
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

    const showTooltip = (target: HTMLElement, cell: CalendarCell, dayIdx: number) => {
        const rect = target.getBoundingClientRect();
        const parent = containerRef.current?.getBoundingClientRect();
        if (!parent) return;
        const rawX = rect.left - parent.left + rect.width / 2;
        const x = Math.min(
            Math.max(rawX, TOOLTIP_HALF_WIDTH),
            Math.max(parent.width - TOOLTIP_HALF_WIDTH, TOOLTIP_HALF_WIDTH)
        );
        const below = dayIdx < 4;
        const y = below ? rect.bottom - parent.top + 6 : rect.top - parent.top - 6;
        setTooltip({ x, y, below, cell });
    };

    const handleCellEnter = (e: React.MouseEvent, cell: CalendarCell, dayIdx: number) =>
        showTooltip(e.currentTarget as HTMLElement, cell, dayIdx);

    const handleCellFocus = (e: React.FocusEvent<HTMLButtonElement>, cell: CalendarCell, dayIdx: number) =>
        showTooltip(e.currentTarget, cell, dayIdx);

    const cellLabel = (cell: CalendarCell) =>
        `${formatDateLabel(cell.date)}: ${formatDuration(
            cell.focusSeconds ?? Math.round(cell.hours * 3600)
        )} focus, ${cell.tasks ?? 0} tasks done`;

    const year = weeks.length
        ? weeks.flat().find((c) => c !== null)?.date.slice(0, 4) ?? String(new Date().getFullYear())
        : String(new Date().getFullYear());

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
        >
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-6 py-4">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                        Activity Calendar
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-ink-faint">
                        Your full-year activity record
                    </p>
                </div>
                <span className="flex-shrink-0 rounded-sm border border-ink px-2 py-1 font-mono text-xs font-bold text-ink">
                    {year}
                </span>
            </div>

            {isLoading ? (
                <div className="px-5 py-6">
                    <div className="space-y-[3px]">
                        {[0, 1, 2, 3, 4, 5, 6].map((r) => (
                            <SkeletonBlock key={r} className="h-[11px] w-full" />
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2.5">
                        <SkeletonBlock className="h-3 w-8" />
                        <SkeletonBlock className="h-3 w-24" />
                        <SkeletonBlock className="h-3 w-8" />
                    </div>
                </div>
            ) : !weeks.length ? (
                <div className="px-6 py-6">
                    <div className="rounded-lg border-2 border-dashed border-line px-6 py-10 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                            No focus sessions yet
                        </p>
                        <p className="mt-1.5 text-xs font-medium text-ink-soft">
                            Start your first session to begin building your activity record.
                        </p>
                        <Link
                            to="/timer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
                        >
                            Start focus
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto px-5 pb-5 pt-5">
                        <div
                            ref={containerRef}
                            className="relative pb-2"
                            style={{ minWidth: LABEL_COLUMN + weeks.length * STEP }}
                        >
                            <div className="relative mb-1.5 h-4" style={{ marginLeft: LABEL_COLUMN }}>
                                {monthMarks.map(({ label, weekIdx }) => (
                                    <div
                                        key={`${label}-${weekIdx}`}
                                        className="absolute text-[10px] font-bold text-ink-faint"
                                        style={{ left: weekIdx * STEP }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div className="flex">
                                <div className="mr-1.5 flex flex-shrink-0 flex-col gap-[3px]">
                                    {DAY_LABELS.map((d, i) => (
                                        <div key={i} className="flex h-[11px] w-6 items-center justify-end">
                                            <span className="text-[9px] font-semibold text-ink-faint">{d}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-[3px]">
                                    {weeks.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-[3px]">
                                            {week.map((cell, di) =>
                                                cell ? (
                                                    <motion.button
                                                        key={cell.date}
                                                        type="button"
                                                        initial={{ scale: 0.6, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: (wi * 7 + di) * 0.0015, duration: 0.2 }}
                                                        whileHover={{ scale: 1.35, zIndex: 10 }}
                                                        whileFocus={{ scale: 1.35, zIndex: 10 }}
                                                        className="relative h-[11px] w-[11px] cursor-pointer rounded-sm"
                                                        style={INTENSITY_STYLE[cell.intensity]}
                                                        aria-label={cellLabel(cell)}
                                                        onMouseEnter={(e) => handleCellEnter(e, cell, di)}
                                                        onMouseLeave={() => setTooltip(null)}
                                                        onFocus={(e) => handleCellFocus(e, cell, di)}
                                                        onBlur={() => setTooltip(null)}
                                                    />
                                                ) : (
                                                    <div key={`empty-${wi}-${di}`} className="h-[11px] w-[11px]" />
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {tooltip && (
                                <div
                                    className="pointer-events-none absolute z-20 whitespace-nowrap rounded-sm bg-ink px-2.5 py-1.5 text-xs text-paper"
                                    style={{
                                        left: tooltip.x,
                                        top: tooltip.y,
                                        transform: tooltip.below
                                            ? "translateX(-50%)"
                                            : "translate(-50%, -100%)",
                                    }}
                                    role="status"
                                >
                                    <div className="font-bold">{formatDateLabel(tooltip.cell.date)}</div>
                                    <div className="mt-0.5 font-mono text-[11px] text-paper/80">
                                        Focus: {formatDuration(tooltip.cell.focusSeconds ?? Math.round(tooltip.cell.hours * 3600))}
                                    </div>
                                    <div className="font-mono text-[11px] text-paper/80">
                                        Tasks: {tooltip.cell.tasks ?? 0}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                            <span>Less</span>
                            <div className="flex items-center gap-1.5">
                                {(["none", "low", "medium", "high"] as Intensity[]).map((intensity) => (
                                    <div
                                        key={intensity}
                                        className="h-3 w-3 rounded-sm border border-line"
                                        style={INTENSITY_STYLE[intensity]}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </>
            )}
        </motion.section>
    );
};

export default CalendarCard;