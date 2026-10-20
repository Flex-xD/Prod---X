import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { quick, progressUpdate } from '@/lib/motion';
import { cn } from '@/utils/utils';
import ActivityCalendar from '../Activity-Calender';
import { CountUp, ExampleNote, LABEL, LinkButton, MONO, PANEL, StreakBlocks } from '../shared';
import { currentStreak, lastSevenDays, pad2, sampleDay } from '../dummy-data';

const GROUP_PROGRESS = 72;

function Cell({ label, foot, className, children }: { label: string; foot: ReactNode; className?: string; children: ReactNode }) {
    return (
        <div className={cn('flex flex-col gap-2 border-line p-4 sm:p-5', className)}>
            <dt className={LABEL}>{label}</dt>
            <dd className={cn(MONO, 'text-3xl font-bold leading-none text-ink')}>{children}</dd>
            <dd className="flex min-h-5 items-center text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{foot}</dd>
        </div>
    );
}

const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...quick, delay },
});

function HeroSection() {
    const today = sampleDay(0);
    const streak = currentStreak();
    const weekHours = lastSevenDays().reduce((sum, d) => sum + d.minutes, 0) / 60;

    return (
        <section className="border-b-2 border-ink">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:py-20">
                <div>
                    <motion.h1 {...reveal(0)} className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                        See what you’ve actually done.
                    </motion.h1>
                    <motion.p {...reveal(0.08)} className="mt-6 max-w-md text-lg text-ink-soft">
                        Prod-X puts every focus session and finished task on one calendar. The work you did last week is
                        still there when you decide whether to work today.
                    </motion.p>
                    <motion.div {...reveal(0.16)} className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <LinkButton to="/auth">Start your record</LinkButton>
                        <LinkButton href="#how-it-works" variant="secondary">
                            See how a day adds up
                        </LinkButton>
                    </motion.div>
                    <motion.p {...reveal(0.22)} className="mt-5 text-sm text-ink-soft">
                        Free to sign up.
                    </motion.p>
                </div>

                <motion.div {...reveal(0.1)} className={cn(PANEL, 'overflow-hidden shadow-hard')}>
                    <div className="flex items-end justify-between gap-4 border-b-2 border-ink px-4 py-3 sm:px-5">
                        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Today’s progress</h2>
                        <p className="font-mono text-xs text-ink-soft">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <dl className="grid grid-cols-2 lg:grid-cols-4">
                        <Cell label="Tasks" foot="Completed today">
                            <CountUp value={today.tasks} />
                            <span className="text-2xl">/{today.tasks + 1}</span>
                        </Cell>
                        <Cell label="Current streak" className="border-l-2" foot={<StreakBlocks count={Math.min(streak, 14)} total={14} />}>
                            <CountUp value={streak} format={pad2} />
                            <span className="text-base"> DAYS</span>
                        </Cell>
                        <Cell label="Focus time" className="border-t-2 lg:border-l-2 lg:border-t-0" foot="This week">
                            <CountUp value={weekHours} format={(n) => n.toFixed(1)} />
                            <span className="text-base">h</span>
                        </Cell>
                        <Cell
                            label="Group session"
                            className="border-l-2 border-t-2 lg:border-t-0"
                            foot={
                                <span className="flex w-full flex-col gap-1.5">
                                    <span aria-hidden className="block h-1.5 w-full overflow-hidden rounded-sm bg-paper-deep">
                                        <motion.span
                                            className="block h-full rounded-sm bg-progress"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${GROUP_PROGRESS}%` }}
                                            viewport={{ once: true }}
                                            transition={{ ...progressUpdate, delay: 0.3 }}
                                        />
                                    </span>
                                    <span className="block truncate">3 members · Study sprint</span>
                                </span>
                            }
                        >
                            <CountUp value={GROUP_PROGRESS} />
                            <span className="text-base">%</span>
                        </Cell>
                    </dl>

                    <div className="border-t-2 border-ink px-4 py-4 sm:px-5">
                        <ActivityCalendar cell={12} gap={3} maxWeeks={30} />
                    </div>
                    <ExampleNote />
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;