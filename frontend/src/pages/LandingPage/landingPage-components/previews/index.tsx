import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/utils';
import ActivityCalendar from '../Activity-Calender';
import { AiTipBlock, DaySummaryBlock } from '../context-block';
import WeeklyBars from '../weekly-bars';
import {
    CountUp,
    LABEL,
    MONO,
    RankRows,
    StreakBlocks,
    TaskProgress,
    TaskRow,
    useReveal,
    type Participant,
} from '../shared';
import { currentStreak, pad2 } from '../dummy-data';

/* ---------- Focus timer: a running session, ticking in real time ---------- */
const SESSION = 25 * 60;
const clockMs = (s: number) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;

export function FocusTimerPreview() {
    const reduce = useReducedMotion();
    const { ref, inView } = useReveal<HTMLDivElement>(0.4);
    const [elapsed, setElapsed] = useState(12 * 60 + 18);

    useEffect(() => {
        if (!inView || reduce) return;
        const id = window.setInterval(() => setElapsed((e) => Math.min(SESSION, e + 1)), 1000);
        return () => window.clearInterval(id);
    }, [inView, reduce]);

    const pct = (elapsed / SESSION) * 100;
    return (
        <div ref={ref} className="space-y-4">
            <div className="focus-ring-invert rounded-lg border-2 border-ink bg-ink p-5 text-paper">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em]">Focus timer</p>
                    <span className="rounded-full bg-focus px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Running</span>
                </div>
                <p
                    role="timer"
                    aria-live="off"
                    aria-label={`Example focus session, ${clockMs(SESSION - elapsed)} remaining, running`}
                    className={cn(MONO, 'text-center text-6xl font-bold leading-none')}
                >
                    {clockMs(SESSION - elapsed)}
                </p>
                <div
                    role="progressbar"
                    aria-label="Session progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pct)}
                    className="mt-5 h-3.5 overflow-hidden rounded-sm border border-paper/25 bg-paper/10"
                >
                    <div className="h-full rounded-sm bg-focus transition-[width] duration-base" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-paper/60">
                    <span>Session progress</span>
                    <span className={MONO}>{Math.round(pct)}%</span>
                </div>
            </div>
            <p className="text-sm text-ink-soft">When you stop, you submit the time and it lands in today’s record.</p>
        </div>
    );
}

/* ---------- Tasks: two tasks get finished, progress follows ---------- */
const TASKS = ['Solve 5 practice problems', 'Read chapter 4 notes', 'Submit lab report'] as const;

export function TasksPreview() {
    const reduce = useReducedMotion();
    const { ref, inView } = useReveal<HTMLDivElement>(0.4);
    const [done, setDone] = useState(1);

    useEffect(() => {
        if (!inView) return;
        if (reduce) {
            setDone(3);
            return;
        }
        const a = window.setTimeout(() => setDone(2), 900);
        const b = window.setTimeout(() => setDone(3), 1900);
        return () => {
            window.clearTimeout(a);
            window.clearTimeout(b);
        };
    }, [inView, reduce]);

    return (
        <div ref={ref} className="space-y-4">
            <TaskProgress done={done} total={TASKS.length} />
            <div className="divide-y divide-line border-y border-line">
                {TASKS.map((t, i) => (
                    <TaskRow key={t} label={t} done={i < done} />
                ))}
            </div>
            <p className="text-sm text-ink-soft">A finished task keeps today’s streak alive, even on a day without a timer.</p>
        </div>
    );
}

/* ---------- Group sessions ---------- */
const GROUP: readonly Participant[] = [
    { name: 'Riya', seconds: 3252 },
    { name: 'You', seconds: 3100 },
    { name: 'Dev', seconds: 2285 },
];

export function GroupPreview() {
    return (
        <div className="space-y-3">
            <div className="-mx-5 border-y border-line sm:-mx-6">
                <RankRows participants={GROUP} goal={3600} />
            </div>
            <p className="text-sm text-ink-soft">Everyone in the session is ranked live. Invites arrive as notifications you can accept or decline.</p>
        </div>
    );
}

/* ---------- Streaks ---------- */
export function StreakPreview() {
    const streak = currentStreak();
    return (
        <div className="space-y-5">
            <div>
                <p className={LABEL}>Current streak</p>
                <p className={cn(MONO, 'mt-2 text-5xl font-bold leading-none')}>
                    <CountUp value={streak} format={pad2} /> <span className="text-xl">DAYS</span>
                </p>
            </div>
            <StreakBlocks count={Math.min(streak, 14)} total={14} />
            <p className="text-sm text-ink-soft">Any day with a session or a finished task adds a block.</p>
        </div>
    );
}

/* ---------- Calendar ---------- */
export const CalendarPreview = () => <ActivityCalendar cell={11} gap={3} maxWeeks={30} />;

/* ---------- Weekly graph ---------- */
export const WeeklyPreview = () => (
    <div className="-m-4 sm:-m-6">
        <WeeklyBars showCaption={false} />
    </div>
);

/* ---------- Daily AI tip ---------- */
export const TipPreview = () => (
    <div className="overflow-hidden rounded-lg border-2 border-ink">
        <AiTipBlock />
    </div>
);

/* ---------- Day summary ---------- */
export const SummaryPreview = () => (
    <div className="overflow-hidden rounded-lg border-2 border-ink">
        <DaySummaryBlock />
    </div>
);