import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';
import { LEVEL_BG, cellFill } from '../shared';
import { currentStreak, dateFor, hoursMinutes, sampleDay } from '../dummy-data';

interface ActivityCalendarProps {
    cell?: number;
    gap?: number;
    maxWeeks?: number;
    className?: string;
}

const KEY_STEP: Record<string, number> = { ArrowLeft: 7, ArrowRight: -7, ArrowUp: 1, ArrowDown: -1 };

/**
 * The signature component: accumulated work over time.
 * Rows are weekdays (Monday first); the last column ends on today. The week
 * count fits the container, so there is no horizontal scrolling.
 * The grid is drawn first, then each column fills in from left to right.
 * One tab stop: arrow keys move between days, hover and tap select too.
 */
function ActivityCalendar({ cell = 12, gap = 3, maxWeeks = 52, className }: ActivityCalendarProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const readoutId = useId();
    const [weeks, setWeeks] = useState(20);
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const fit = () => {
            const fitted = Math.floor((el.clientWidth + gap) / (cell + gap));
            setWeeks(Math.max(8, Math.min(maxWeeks, fitted)));
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(el);
        return () => observer.disconnect();
    }, [cell, gap, maxWeeks]);

    const todayRow = (new Date().getDay() + 6) % 7;
    const maxDaysAgo = (weeks - 1) * 7 + todayRow;
    const days = Array.from(
        { length: weeks * 7 },
        (_, i) => (weeks - 1 - Math.floor(i / 7)) * 7 + (todayRow - (i % 7)),
    );
    const activeDays = days.filter((d) => d >= 0 && sampleDay(d).level > 0).length;

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const delta = KEY_STEP[e.key];
        if (delta === undefined) return;
        e.preventDefault();
        setSelected((prev) => Math.min(maxDaysAgo, Math.max(0, (prev ?? 0) + delta)));
    };

    const picked = selected === null ? null : sampleDay(selected);
    const readout = picked
        ? `${dateFor(picked.daysAgo).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}: ${hoursMinutes(picked.minutes)}, ${picked.tasks} tasks done`
        : 'Hover, tap, or use the arrow keys to read a day.';

    return (
        <div ref={containerRef} className={className}>
            <div
                role="group"
                tabIndex={0}
                onKeyDown={onKeyDown}
                aria-describedby={readoutId}
                aria-label={`Example activity calendar, last ${weeks} weeks: ${activeDays} active days, current streak ${currentStreak()} days. Use arrow keys to move between days.`}
                className="w-fit rounded-sm"
            >
                <motion.div
                    aria-hidden
                    className="grid"
                    variants={{ hidden: {}, show: {} }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{
                        gridAutoFlow: 'column',
                        gridTemplateRows: `repeat(7, ${cell}px)`,
                        gridAutoColumns: `${cell}px`,
                        gap,
                    }}
                >
                    {days.map((daysAgo, i) => {
                        if (daysAgo < 0) return <span key={`future-${i}`} />;
                        const sample = sampleDay(daysAgo);
                        return (
                            <span
                                key={daysAgo}
                                onMouseEnter={() => setSelected(daysAgo)}
                                onClick={() => setSelected(daysAgo)}
                                className={cn(
                                    'relative block rounded-xs bg-paper-deep',
                                    daysAgo === 0 && 'ring-1 ring-ink',
                                    selected === daysAgo && 'ring-2 ring-ink',
                                )}
                            >
                                {sample.level > 0 && (
                                    <motion.span
                                        variants={cellFill}
                                        custom={Math.floor(i / 7) * 0.02}
                                        className={cn('absolute inset-0 rounded-xs', LEVEL_BG[sample.level])}
                                    />
                                )}
                            </span>
                        );
                    })}
                </motion.div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <p id={readoutId} aria-live="polite" className="min-h-5 text-xs font-medium text-ink-soft">
                    {readout}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                    <span>Less</span>
                    {LEVEL_BG.map((bg) => (
                        <span key={bg} aria-hidden className={cn('size-3 rounded-xs border border-line', bg)} />
                    ))}
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}

export default ActivityCalendar;