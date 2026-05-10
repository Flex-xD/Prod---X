import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

interface CalendarData {
    intensity: 'high' | 'medium' | 'low' | 'none';
    hours: number;
}

interface CalendarCardProps {
    calendarData: CalendarData[][];
}

// Full 12-month labels for a year view (52 weeks + partial)
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const INTENSITY_STYLE: Record<CalendarData['intensity'], React.CSSProperties> = {
    high: { background: '#7C3AED', boxShadow: '0 0 6px rgba(124,58,237,0.45)' },
    medium: { background: '#a78bfa' },
    low: { background: '#ddd6fe' },
    none: { background: '#f1f5f9' },
};

// We spread the provided calendarData across 53 weeks to simulate a full year.
// If real 52-week data is passed this is transparent; shorter data repeats.
const YEAR_WEEKS = 53;

const CalendarCard = ({ calendarData }: CalendarCardProps) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; hours: number; label: string } | null>(null);

    // Normalise / pad the data to exactly YEAR_WEEKS weeks
    const yearData = useMemo<CalendarData[][]>(() => {
        if (!calendarData.length) return [];
        return Array.from({ length: YEAR_WEEKS }, (_, wi) => {
            const src = calendarData[wi % calendarData.length];
            return Array.from({ length: 7 }, (_, di) => src?.[di] ?? { intensity: 'none', hours: 0 });
        });
    }, [calendarData]);

    // Map week index → month label position
    const monthPositions = useMemo(() => {
        const result: { label: string; weekIdx: number }[] = [];
        const weeksPerMonth = YEAR_WEEKS / 12;
        MONTH_LABELS.forEach((label, i) => {
            result.push({ label, weekIdx: Math.round(i * weeksPerMonth) });
        });
        return result;
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleCellEnter = (e: React.MouseEvent, hours: number, weekIdx: number, dayIdx: number) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const parent = containerRef.current?.getBoundingClientRect();
        if (!parent) return;
        setTooltip({
            x: rect.left - parent.left + rect.width / 2,
            y: rect.top - parent.top,
            hours,
            label: `${hours}h`,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 28, stiffness: 280 }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                <div>
                    <h3 className="font-black text-slate-900 text-base">Activity Calendar</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Your full-year productivity heatmap</p>
                </div>
                <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}
                >
                    {new Date().getFullYear()}
                </span>
            </div>

            <div className="px-5 pb-6 overflow-x-auto">
                <div ref={containerRef} className="relative" style={{ minWidth: 660 }}>
                    {/* Month labels row */}
                    <div className="flex mb-1.5 pl-8">
                        {monthPositions.map(({ label, weekIdx }) => (
                            <div
                                key={label}
                                className="text-xs font-bold text-slate-400 absolute"
                                style={{ left: `calc(32px + ${weekIdx * 14}px)` }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-0 mt-4">
                        {/* Day-of-week labels */}
                        <div className="flex flex-col gap-[3px] mr-1.5 flex-shrink-0">
                            {DAY_LABELS.map((d, i) => (
                                <div key={i} className="w-6 h-[11px] flex items-center justify-end">
                                    <span className="text-[9px] font-semibold text-slate-300">{d}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="flex gap-[3px]">
                            {yearData.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((day, di) => (
                                        <motion.div
                                            key={`${wi}-${di}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: (wi * 7 + di) * 0.0015, duration: 0.2 }}
                                            whileHover={{ scale: 1.5, zIndex: 10 }}
                                            className="w-[11px] h-[11px] rounded-sm cursor-pointer relative"
                                            style={INTENSITY_STYLE[day.intensity]}
                                            onMouseEnter={e => handleCellEnter(e, day.hours, wi, di)}
                                            onMouseLeave={() => setTooltip(null)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating tooltip */}
                    {tooltip && (
                        <div
                            className="absolute z-20 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap -translate-x-1/2 -translate-y-full"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y - 6,
                                background: '#1e293b',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                            }}
                        >
                            {tooltip.label}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-400">
                    <span>Less</span>
                    <div className="flex gap-1.5 items-center">
                        {(['none', 'low', 'medium', 'high'] as CalendarData['intensity'][]).map(intensity => (
                            <div
                                key={intensity}
                                className="w-3 h-3 rounded-sm"
                                style={INTENSITY_STYLE[intensity]}
                            />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarCard;