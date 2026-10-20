import { useState, type ComponentType } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { quick } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { PANEL, SectionHeading } from '../shared';
import {
    CalendarPreview,
    FocusTimerPreview,
    GroupPreview,
    StreakPreview,
    SummaryPreview,
    TasksPreview,
    TipPreview,
    WeeklyPreview,
} from '../previews';

type Tone = 'focus' | 'progress' | 'info';

// Color follows Prod-X meaning: orange = focus, green = completion, blue-green = information.
const TONE_SWATCH: Record<Tone, string> = { focus: 'bg-focus', progress: 'bg-progress', info: 'bg-info' };
const TONE_TINT: Record<Tone, string> = { focus: 'bg-focus-tint', progress: 'bg-progress-tint', info: 'bg-info-tint' };

interface Feature {
    id: string;
    name: string;
    body: string;
    adds: string;
    tone: Tone;
    Preview: ComponentType;
}

const FEATURES: readonly Feature[] = [
    {
        id: 'timer',
        name: 'Focus timer',
        body: 'Start a session, work, and submit the time when you stop. It records what you actually sat down and did.',
        adds: 'Focus time',
        tone: 'focus',
        Preview: FocusTimerPreview,
    },
    {
        id: 'tasks',
        name: 'Tasks',
        body: 'List what you need to do today and check it off. Progress updates as you finish each one.',
        adds: 'Tasks done',
        tone: 'progress',
        Preview: TasksPreview,
    },
    {
        id: 'groups',
        name: 'Group sessions',
        body: 'Invite up to 5 people into a timed session with a shared goal and see everyone ranked live.',
        adds: 'Your rank',
        tone: 'focus',
        Preview: GroupPreview,
    },
    {
        id: 'streak',
        name: 'Streak',
        body: 'Your streak counts the days in a row you did the work, so a missed day is easy to see.',
        adds: 'Days in a row',
        tone: 'progress',
        Preview: StreakPreview,
    },
    {
        id: 'calendar',
        name: 'Activity calendar',
        body: 'One square for every day you worked, darker for more work, so consistency is visible at a glance.',
        adds: 'Daily activity level',
        tone: 'progress',
        Preview: CalendarPreview,
    },
    {
        id: 'weekly',
        name: 'Weekly focus graph',
        body: 'Focus time for each of the last seven days, so you can see where the week went.',
        adds: 'Focus per day',
        tone: 'info',
        Preview: WeeklyPreview,
    },
    {
        id: 'tip',
        name: 'Daily AI tip',
        body: 'One short suggestion based on how your day is going, not a generic quote.',
        adds: 'A next step',
        tone: 'info',
        Preview: TipPreview,
    },
    {
        id: 'summary',
        name: 'Day summary',
        body: 'A running summary of your day that updates as you work.',
        adds: 'Your day so far',
        tone: 'info',
        Preview: SummaryPreview,
    },
];

function FeaturePanel({ feature }: { feature: Feature }) {
    return (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={quick}>
            <div className="flex flex-col gap-3 border-b-2 border-ink px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                <div>
                    <h3 className="text-lg font-bold">{feature.name}</h3>
                    <p className="mt-1 max-w-md text-sm text-ink-soft">{feature.body}</p>
                </div>
                <p
                    className={cn(
                        'shrink-0 rounded-sm border-2 border-ink px-2 py-1 text-xs font-bold',
                        TONE_TINT[feature.tone],
                    )}
                >
                    Adds: {feature.adds}
                </p>
            </div>
            <div className="min-h-[300px] p-4 sm:p-6">
                <feature.Preview />
            </div>
        </motion.div>
    );
}

function FeaturesSection() {
    const [value, setValue] = useState<string>(FEATURES[0].id);

    return (
        <section id="features" className="group/section scroll-mt-16 border-b-2 border-ink bg-surface">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
                <div className="max-w-2xl">
                    <SectionHeading>Everything Prod-X does.</SectionHeading>
                    <p className="mt-4 text-lg text-ink-soft">
                        Each feature adds something to the same record. Pick one to see what it looks like in use.
                    </p>
                </div>

                <TabsPrimitive.Root
                    value={value}
                    onValueChange={setValue}
                    orientation="vertical"
                    className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start"
                >
                    <TabsPrimitive.List
                        aria-label="Prod-X features"
                        className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0 lg:overflow-hidden lg:rounded-lg lg:border-2 lg:border-ink lg:bg-paper"
                    >
                        {FEATURES.map((f, i) => (
                            <TabsPrimitive.Trigger
                                key={f.id}
                                value={f.id}
                                className="group flex items-center gap-3 rounded-sm border-2 border-ink bg-surface px-3 py-2 text-left text-ink transition-colors duration-fast hover:bg-paper-deep focus-visible:outline-offset-[-4px] data-[state=active]:bg-ink data-[state=active]:text-paper data-[state=active]:hover:bg-ink data-[state=active]:focus-visible:outline-paper lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:bg-paper lg:px-4 lg:py-3.5 lg:last:border-b-0"
                            >
                                <span className="hidden font-mono text-xs font-bold text-ink-soft group-data-[state=active]:text-paper/70 lg:inline">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-sm font-bold lg:text-base">{f.name}</span>
                                <span
                                    aria-hidden
                                    className={cn(
                                        'ml-auto hidden size-3 border-2 border-ink group-data-[state=active]:border-paper lg:block',
                                        TONE_SWATCH[f.tone],
                                    )}
                                />
                            </TabsPrimitive.Trigger>
                        ))}
                    </TabsPrimitive.List>

                    <div className={cn(PANEL, 'overflow-hidden shadow-hard')}>
                        {FEATURES.map((f) => (
                            <TabsPrimitive.Content key={f.id} value={f.id}>
                                <FeaturePanel feature={f} />
                            </TabsPrimitive.Content>
                        ))}
                    </div>
                </TabsPrimitive.Root>
            </div>
        </section>
    );
}

export default FeaturesSection;