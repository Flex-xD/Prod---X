import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/utils';
import { ExampleNote, MONO, PANEL, RankRows, SectionHeading, mmss, useReveal } from '../shared';

const GOAL = 3600;

// Example session. Rates are seconds gained per tick, chosen so ranks change hands.
const START = [
    { name: 'Sam', seconds: 3180, rate: 14 },
    { name: 'Riya', seconds: 3020, rate: 22 },
    { name: 'You', seconds: 2900, rate: 30 },
    { name: 'Dev', seconds: 2285, rate: 60 },
] as const;

const initial = (): number[] => START.map((p) => p.seconds);

function GroupSection() {
    const { ref, inView } = useReveal<HTMLDivElement>(0.5);
    const reduce = useReducedMotion();
    const [seconds, setSeconds] = useState<number[]>(initial);
    const [run, setRun] = useState(0);
    const current = useRef<number[]>(initial());

    useEffect(() => {
        if (!inView || reduce) return;
        current.current = initial();
        setSeconds(current.current);
        const id = window.setInterval(() => {
            current.current = current.current.map((s, i) => Math.min(GOAL, s + START[i].rate));
            setSeconds(current.current);
            if (current.current.every((s) => s >= GOAL)) window.clearInterval(id);
        }, 600);
        return () => window.clearInterval(id);
    }, [inView, reduce, run]);

    const complete = seconds.every((s) => s >= GOAL);
    const ranked = START.map((p, i) => ({ name: p.name, seconds: seconds[i] })).sort((a, b) => b.seconds - a.seconds);

    return (
        <section id="groups" className="group/section scroll-mt-16 border-b-2 border-ink">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16 lg:py-24">
                <div>
                    <SectionHeading>Work next to people who are also working.</SectionHeading>
                    <p className="mt-4 max-w-md text-lg text-ink-soft">
                        Invite up to 5 people into a timed session with a shared goal. Rankings update live while the
                        session runs, so you can see who is still focused.
                    </p>
                    <p className="mt-4 max-w-md text-lg text-ink-soft">
                        Invites arrive as notifications, and you choose whether to accept or decline.
                    </p>
                </div>

                <div ref={ref} className={cn(PANEL, 'overflow-hidden shadow-hard')}>
                    <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink px-4 py-3 sm:px-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.12em]">Study sprint</h3>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                            Goal <span className={MONO}>{mmss(GOAL)}</span>
                        </span>
                    </div>

                    <RankRows participants={ranked} goal={GOAL} />

                    {complete && (
                        <div className="border-t-2 border-ink px-4 py-3 sm:px-6">
                            <button
                                type="button"
                                onClick={() => setRun((r) => r + 1)}
                                className="rounded-lg border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink shadow-hard-xs transition-all duration-fast hover:shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                Replay example
                            </button>
                        </div>
                    )}
                    <ExampleNote>Example session. Names and times are made up.</ExampleNote>
                </div>
            </div>
        </section>
    );
}

export default GroupSection;