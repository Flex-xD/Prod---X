import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CalendarIntensity } from '../collections-row/collections-row-types';
import type { IActivityCalendarProps } from './activity-calendar-types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const intensityStyles: Record<CalendarIntensity, string> = {
    none: 'bg-slate-100 border border-slate-200/80 hover:bg-slate-200',
    low: 'bg-purple-200 border border-purple-300/80 hover:bg-purple-300',
    medium: 'bg-purple-400 border border-purple-500/80 hover:bg-purple-500',
    high: 'bg-purple-600 border border-purple-700/80 hover:bg-purple-700',
};

const intensityGlow: Record<CalendarIntensity, string> = {
    none: '',
    low: '',
    medium: 'shadow-[0_0_4px_rgba(168,85,247,0.4)]',
    high: 'shadow-[0_0_6px_rgba(147,51,234,0.7)]',
};

// ─── Month label positions ────────────────────────────────────────────────────
// For a 53-week year grid, we pre-compute which column each month starts at.
// This is approximate (based on real calendar week offsets).
const MONTH_START_WEEKS = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 43, 48];

// ─── Component ────────────────────────────────────────────────────────────────

const ActivityCalendar = ({ data, totalHours }: IActivityCalendarProps) => {
    const totalDays = data.flat().filter((c) => c.intensity !== 'none').length;
    const highDays = data.flat().filter((c) => c.intensity === 'high').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-purple-100/40 p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-100">
                        <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-700">Activity Calendar</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Full year of focus activity</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="border-purple-200 text-purple-600 font-medium text-xs">
                        {totalHours} hrs total
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-600 font-medium text-xs">
                        {totalDays} active days
                    </Badge>
                    <Badge variant="outline" className="border-orange-200 text-orange-600 font-medium text-xs">
                        🔥 {highDays} peak days
                    </Badge>
                </div>
            </div>

            {/* Calendar grid wrapper — horizontally scrollable on mobile */}
            <div className="overflow-x-auto pb-2">
                <div className="min-w-[660px]">

                    {/* Month labels */}
                    <div className="flex mb-1.5 pl-8">
                        {MONTH_LABELS.map((month, i) => (
                            <div
                                key={month}
                                className="text-[10px] text-slate-400 font-medium"
                                style={{
                                    position: 'relative',
                                    left: `${MONTH_START_WEEKS[i] * 14}px`,
                                    minWidth: 28,
                                }}
                            >
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Day labels + grid */}
                    <div className="flex gap-0">
                        {/* Day of week labels */}
                        <div className="flex flex-col gap-[3px] mr-2 pt-0.5">
                            {DAY_LABELS.map((d, i) => (
                                <div key={i} className="h-[11px] text-[9px] text-slate-400 font-medium leading-[11px] w-6 text-right pr-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        <TooltipProvider delayDuration={80}>
                            <div className="flex gap-[3px]">
                                {data.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-[3px]">
                                        {week.map((cell, di) => (
                                            <Tooltip key={di}>
                                                <TooltipTrigger asChild>
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.4 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{
                                                            delay: (wi * 7 + di) * 0.0015,
                                                            duration: 0.25,
                                                            ease: 'backOut',
                                                        }}
                                                        className={`
                              w-[11px] h-[11px] rounded-[2px] cursor-pointer
                              transition-all duration-150
                              ${intensityStyles[cell.intensity]}
                              ${intensityGlow[cell.intensity]}
                            `}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="top"
                                                    className="text-xs bg-slate-800 text-white border-0 px-2 py-1 rounded-lg shadow-lg"
                                                >
                                                    {cell.date
                                                        ? <span className="font-medium">{cell.date} — </span>
                                                        : null}
                                                    {cell.hours > 0
                                                        ? `${cell.hours}h focused`
                                                        : 'No activity'}
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

            {/* Footer: legend + streak summary */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Less</span>
                    {(['none', 'low', 'medium', 'high'] as CalendarIntensity[]).map((level) => (
                        <div
                            key={level}
                            className={`w-[11px] h-[11px] rounded-[2px] ${intensityStyles[level]}`}
                        />
                    ))}
                    <span className="text-[10px] text-slate-400">More</span>
                </div>

                <p className="text-[10px] text-slate-400">
                    Each cell = 1 day &nbsp;·&nbsp; Color = focus intensity
                </p>
            </div>
        </motion.div>
    );
};

export default ActivityCalendar;