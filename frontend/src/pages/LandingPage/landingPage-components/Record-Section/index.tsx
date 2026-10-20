import { cn } from '@/utils/utils';
import ActivityCalendar from '../Activity-Calender';
import { CountUp, ExampleNote, LABEL, MONO, PANEL, SectionHeading, StreakBlocks } from '../shared';
import { currentStreak, pad2 } from '../dummy-data';
import { AiTipBlock, DaySummaryBlock } from '../context-block';
import WeeklyBars from '../weekly-bars';

function StreakRow() {
    const streak = currentStreak();
    return (
        <div className="border-t-2 border-ink p-4 sm:p-6">
            <p className={LABEL}>Current streak</p>
            <p className={cn(MONO, 'mt-2 text-5xl font-bold leading-none')}>
                <CountUp value={streak} format={pad2} duration={1.1} /> <span className="text-xl">DAYS</span>
            </p>
            <div className="mt-4">
                <StreakBlocks count={Math.min(streak, 14)} total={14} />
            </div>
        </div>
    );
}

function RecordSection() {
    return (
        <section id="record" className="group/section scroll-mt-16 border-b-2 border-ink">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
                <div className="max-w-2xl">
                    <SectionHeading>A calendar of the work you did.</SectionHeading>
                    <p className="mt-4 text-lg text-ink-soft">
                        Every day you worked fills a square, and darker squares mean more work. After a few weeks you can
                        see how consistent you’ve been without trying to remember.
                    </p>
                </div>

                <div className={cn(PANEL, 'mt-10 overflow-hidden shadow-hard')}>
                    <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-4 py-4 sm:px-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.12em]">Activity calendar</h3>
                            <p className="mt-1 text-xs font-medium text-ink-soft">Your full-year activity record</p>
                        </div>
                        <span className="shrink-0 rounded-sm border border-ink px-2 py-1 font-mono text-xs font-bold">
                            {new Date().getFullYear()}
                        </span>
                    </div>
                    <div className="p-4 sm:p-6">
                        <ActivityCalendar cell={14} gap={3} maxWeeks={52} />
                    </div>

                    <StreakRow />

                    <div className="grid border-t-2 border-ink lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                        <div className="border-b-2 border-ink lg:border-b-0 lg:border-r-2">
                            <WeeklyBars />
                        </div>
                        <div className="divide-y-2 divide-ink">
                            <AiTipBlock />
                            <DaySummaryBlock />
                        </div>
                    </div>
                    <ExampleNote />
                </div>
            </div>
        </section>
    );
}

export default RecordSection;