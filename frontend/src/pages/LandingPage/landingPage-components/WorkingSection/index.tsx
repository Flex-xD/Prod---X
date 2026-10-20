import { useState } from 'react';
import { motion } from 'framer-motion';
import { quick } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { ExampleNote, LABEL, LEVEL_BG, MONO, PANEL, SectionHeading, TaskProgress, TaskRow } from '../shared';

const STEPS = [
    {
        title: 'Start a session',
        body: 'Work alone, or invite up to 5 people into a shared session. The timer counts what you actually do.',
    },
    {
        title: 'Log what you did',
        body: 'When you stop, submit the time. Check off any task you finished while you were at it.',
    },
    {
        title: 'Watch the record grow',
        body: 'Today’s square fills in and your streak moves forward. Tomorrow you can see exactly where you left off.',
    },
] as const;

const TASKS = [
    { id: 'problems', label: 'Solve 5 practice problems' },
    { id: 'notes', label: 'Read chapter 4 notes' },
    { id: 'report', label: 'Submit lab report' },
] as const;

const SQUARE_STATE = ['Empty', 'Light', 'Solid', 'Full'] as const;
const LEVELS = [0, 1, 2, 3] as const;

function Step({ index, title, body }: { index: number; title: string; body: string }) {
    return (
        <motion.li
            variants={{ idle: {}, done: {} }}
            initial="idle"
            whileInView="done"
            viewport={{ once: true, margin: '0px 0px -30% 0px' }}
            className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5 last:border-b-2 last:border-ink"
        >
            <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-sm border-2 border-ink bg-surface">
                <motion.span
                    variants={{ idle: { scaleY: 0 }, done: { scaleY: 1 } }}
                    transition={quick}
                    className="absolute inset-0 origin-bottom bg-progress"
                />
                <span className={cn(MONO, 'relative text-lg font-bold')}>{index}</span>
            </span>
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1 max-w-md text-ink-soft">{body}</p>
            </div>
        </motion.li>
    );
}

function DayDemo() {
    const [done, setDone] = useState<ReadonlySet<string>>(new Set(['problems']));

    const toggle = (id: string) =>
        setDone((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const count = done.size;
    const level = LEVELS[count];

    return (
        <div className={cn(PANEL, 'overflow-hidden shadow-hard')}>
            <div className="border-b-2 border-ink px-4 py-3 sm:px-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em]">Today’s tasks</h3>
                <p className="mt-1 text-xs font-medium text-ink-soft">Example tasks. Check them off and watch the record change.</p>
            </div>

            <div className="divide-y divide-line px-4 sm:px-6">
                {TASKS.map((task) => (
                    <TaskRow key={task.id} label={task.label} done={done.has(task.id)} onToggle={() => toggle(task.id)} />
                ))}
            </div>

            <div className="space-y-5 border-t-2 border-ink p-4 sm:p-6">
                <TaskProgress done={count} total={TASKS.length} />

                <div className="flex items-center gap-4" aria-live="polite">
                    <span aria-hidden className={cn('size-10 shrink-0 rounded-sm border-2 border-ink transition-colors duration-base', LEVEL_BG[level])} />
                    <div>
                        <p className={LABEL}>Today’s square</p>
                        <p className="text-sm font-semibold">
                            {SQUARE_STATE[level]}.{' '}
                            <span className="font-medium text-ink-soft">
                                {count > 0 ? 'Today counts toward your streak.' : 'Nothing logged yet, so today does not count.'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <ExampleNote>Example only. Nothing here is saved.</ExampleNote>
        </div>
    );
}

function WorkingSection() {
    return (
        <section id="how-it-works" className="group/section scroll-mt-16 border-b-2 border-ink">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
                <div>
                    <SectionHeading>One day, added up.</SectionHeading>
                    <p className="mt-4 max-w-md text-lg text-ink-soft">
                        Three steps, repeated every day. The panel next to this is a working example.
                    </p>
                    <ol className="mt-8 border-t-2 border-ink">
                        {STEPS.map((step, i) => (
                            <Step key={step.title} index={i + 1} title={step.title} body={step.body} />
                        ))}
                    </ol>
                </div>
                <DayDemo />
            </div>
        </section>
    );
}

export default WorkingSection;