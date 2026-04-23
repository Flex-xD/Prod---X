import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { IActivityCalendarProps } from './activity-calendar-types';
import type { CalendarIntensity } from '../collections-row/collections-row-types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_START_WEEKS = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 43, 48];

// Static class strings — defined outside component so they're never recreated
const intensityClass: Record<CalendarIntensity, string> = {
    none: 'bg-slate-100 border border-slate-200/80',
    low: 'bg-violet-200 border border-violet-300/80',
    medium: 'bg-violet-400 border border-violet-500/80',
    high: 'bg-violet-600 border border-violet-700/80 shadow-[0_0_4px_rgba(139,92,246,0.5)]',
};

const legendItems: { intensity: CalendarIntensity; label: string }[] = [
    { intensity: 'none', label: 'No activity' },
    { intensity: 'low', label: '1–2 hrs' },
    { intensity: 'medium', label: '3–4 hrs' },
    { intensity: 'high', label: '5–6 hrs' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ActivityCalendar = ({ data, totalHours }: IActivityCalendarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    const totalDays = data.flat().filter((c) => c.intensity !== 'none').length;
    const highDays = data.flat().filter((c) => c.intensity === 'high').length;

    return (
        <div
            ref={ref}
            className="fade-up-card bg-white/75 backdrop-blur-sm rounded-3xl border border-white/70 shadow-xl shadow-violet-100/30 p-6"
            style={{ animationDelay: '0.45s' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-50">
                        <Zap className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 leading-tight">Activity Calendar</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Full year of focus activity</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="border-violet-200 text-violet-600 text-[11px] px-2 py-0.5 font-medium">
                        {totalHours} hrs total
                    </Badge>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-600 text-[11px] px-2 py-0.5 font-medium">
                        {totalDays} active days
                    </Badge>
                    <Badge variant="outline" className="border-orange-200 text-orange-600 text-[11px] px-2 py-0.5 font-medium">
                        🔥 {highDays} peak days
                    </Badge>
                </div>
            </div>

            {/* Scrollable grid */}
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
                <div className="min-w-[660px]">

                    {/* Month labels — absolutely positioned for perfect alignment */}
                    <div className="relative h-5 mb-1 pl-8">
                        {MONTH_LABELS.map((month, i) => (
                            <span
                                key={month}
                                className="absolute text-[10px] text-slate-400 font-medium leading-none"
                                style={{ left: `${32 + MONTH_START_WEEKS[i] * 14}px`, top: 4 }}
                            >
                                {month}
                            </span>
                        ))}
                    </div>

                    <div className="flex">
                        {/* Day-of-week labels */}
                        <div className="flex flex-col gap-[3px] mr-2 shrink-0 pt-px">
                            {DAY_LABELS.map((d, i) => (
                                <div key={i} className="h-[11px] text-[9px] text-slate-400 font-medium leading-[11px] w-6 text-right select-none">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/*
              PERFORMANCE KEY:
              The entire grid is ONE element with a single CSS opacity transition.
              isInView triggers it once → browser composites one layer, not 371.
              Each cell only uses CSS `transition-transform` on hover — GPU native.
              No framer-motion per cell = no 371 JS animation timelines.
            */}
                        <TooltipProvider delayDuration={150}>
                            <div
                                className="flex gap-[3px] transition-opacity duration-500 ease-out"
                                style={{ opacity: isInView ? 1 : 0 }}
                            >
                                {data.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-[3px]">
                                        {week.map((cell, di) => (
                                            <Tooltip key={di}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={[
                                                            'w-[11px] h-[11px] rounded-[2px] cursor-pointer',
                                                            'transition-transform duration-100 ease-out hover:scale-125',
                                                            intensityClass[cell.intensity],
                                                        ].join(' ')}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="top"
                                                    className="text-[11px] bg-slate-800 text-white border-0 px-2 py-1 rounded-lg shadow-xl"
                                                >
                                                    {cell.date && <span className="font-semibold">{cell.date} — </span>}
                                                    {cell.hours > 0 ? `${cell.hours}h focused` : 'No activity'}
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 flex-wrap gap-2">
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 select-none">Less</span>
                        {legendItems.map(({ intensity, label }) => (
                            <Tooltip key={intensity}>
                                <TooltipTrigger asChild>
                                    <div className={`w-[11px] h-[11px] rounded-[2px] cursor-default ${intensityClass[intensity]}`} />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[11px] bg-slate-800 text-white border-0 px-2 py-1 rounded-lg">
                                    {label}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        <span className="text-[10px] text-slate-400 select-none">More</span>
                    </div>
                </TooltipProvider>
                <p className="text-[10px] text-slate-400 hidden sm:block select-none">
                    1 cell = 1 day · color = focus intensity
                </p>
            </div>
        </div>
    );
};

export default ActivityCalendar;