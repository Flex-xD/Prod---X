import { motion } from 'framer-motion';
import { progressUpdate } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { CountUp, LABEL, MONO, useReveal } from '../shared';
import { clock, dateFor, hoursMinutes, lastSevenDays } from '../dummy-data';

const BAR_AREA = 144;

/**
 * Where did my focused time go this week? Bars grow from the baseline when the
 * chart scrolls into view. Orange = focus time, matching the Dashboard graph.
 * Hover or keyboard focus on a day shows its exact numbers.
 */
function WeeklyBars({ showCaption = true }: { showCaption?: boolean }) {
    const days = lastSevenDays();
    const maxMinutes = Math.max(...days.map((d) => d.minutes), 1);
    const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
    const { ref, inView } = useReveal<HTMLDivElement>(0.5);

    return (
        <figure ref={ref} className="p-4 sm:p-6">
            {showCaption && (
                <figcaption className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.12em]">Weekly activity</h3>
                        <p className="mt-1 text-xs font-medium text-ink-soft">Focus time per day, last 7 days</p>
                    </div>
                    <p className={cn(MONO, 'text-sm font-bold')}>
                        <CountUp value={totalMinutes} format={clock} />
                    </p>
                </figcaption>
            )}

            <div className={cn('relative', showCaption ? 'mt-6 pt-10' : 'pt-10')}>
                <div aria-hidden className="absolute inset-x-0 top-10 border-t border-dashed border-ink/25" />
                <span aria-hidden className={cn(MONO, 'absolute right-0 top-[1.4rem] text-[10px] text-ink-soft')}>
                    {clock(maxMinutes)}
                </span>

                <div className="flex items-end justify-between gap-2" style={{ height: BAR_AREA }}>
                    {days.map((d, i) => {
                        const isToday = i === days.length - 1;
                        const heightPx = d.minutes > 0 ? Math.max((d.minutes / maxMinutes) * BAR_AREA, 6) : 0;
                        const weekday = isToday ? 'Today' : dateFor(d.daysAgo).toLocaleDateString(undefined, { weekday: 'short' });
                        return (
                            <div
                                key={d.daysAgo}
                                tabIndex={0}
                                role="img"
                                aria-label={`${weekday}: ${hoursMinutes(d.minutes)}, ${d.tasks} tasks done`}
                                className="group relative flex h-full flex-1 flex-col justify-end rounded-sm"
                            >
                                <div
                                    className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2.5 py-1.5 text-xs text-paper opacity-0 transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100"
                                    style={{ bottom: heightPx + 8 }}
                                >
                                    <div className="font-bold">
                                        {dateFor(d.daysAgo).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="mt-0.5 font-mono text-[11px] text-paper/80">Focus: {clock(d.minutes)}</div>
                                    <div className="font-mono text-[11px] text-paper/80">Tasks: {d.tasks}</div>
                                </div>
                                <motion.div
                                    className={cn('w-full rounded-t-sm', isToday ? 'border-2 border-b-0 border-ink bg-focus' : 'bg-focus/55')}
                                    initial={{ height: 0 }}
                                    animate={{ height: inView ? heightPx : 0 }}
                                    transition={{ ...progressUpdate, delay: i * 0.06 }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div aria-hidden className="h-0.5 bg-ink" />
                <div aria-hidden className="mt-2 flex justify-between gap-2">
                    {days.map((d, i) => (
                        <div key={d.daysAgo} className="flex-1 text-center">
                            <p className={cn('text-[11px] font-bold', i === days.length - 1 ? 'text-ink' : 'text-ink-soft')}>
                                {i === days.length - 1 ? 'Today' : dateFor(d.daysAgo).toLocaleDateString(undefined, { weekday: 'short' })}
                            </p>
                            <p className={cn(MONO, 'text-[10px] text-ink-soft')}>{clock(d.minutes)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <span className={cn(LABEL, 'sr-only')}>Weekly focus chart</span>
        </figure>
    );
}

export default WeeklyBars;