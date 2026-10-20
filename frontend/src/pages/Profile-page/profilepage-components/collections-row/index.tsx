import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CheckCircle2, Clock3, AlertTriangle, ListTodo } from 'lucide-react';
import type { ICategoryBreakdownProps } from './collections-row-types';
import { enter } from '@/lib/motion';

// Row icon color = the state that row measures, via the *-deep text
// variants (raw accents fail contrast on paper): done/completed =
// progress, pending/active = focus, expired = alert, totals neutral.
const TONE_CLASS = {
    neutral: 'text-ink-soft',
    progress: 'text-progress-deep',
    focus: 'text-focus-deep',
    alert: 'text-alert-deep',
} as const;

type Tone = keyof typeof TONE_CLASS;

const Row = ({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: typeof CheckCircle2;
    label: string;
    value: number;
    tone: Tone;
}) => (
    <div className="flex items-center justify-between py-2.5">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-soft">
            <Icon className={`h-4 w-4 ${TONE_CLASS[tone]}`} aria-hidden="true" /> {label}
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-ink">{value}</span>
    </div>
);

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard">
        <div className="border-b-2 border-ink px-5 py-3.5">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">{title}</h3>
        </div>
        <div className="divide-y divide-line px-5 pb-4 pt-1">{children}</div>
    </div>
);

const CategoryBreakdown = ({ stats }: ICategoryBreakdownProps) => {
    return (
        // One arrival per section: the row of three panels arrives together.
        <motion.div {...enter(0.12)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Panel title="Today's Tasks">
                <Row icon={ListTodo} tone="neutral" label="Total" value={stats.tasks.totalToday} />
                <Row icon={CheckCircle2} tone="progress" label="Done" value={stats.tasks.done} />
                <Row icon={Clock3} tone="focus" label="Pending" value={stats.tasks.pending} />
            </Panel>

            <Panel title="Individual Timers">
                <Row icon={Clock3} tone="focus" label="Active" value={stats.individualTimers.active} />
                <Row
                    icon={CheckCircle2}
                    tone="progress"
                    label="Completed"
                    value={stats.individualTimers.completed}
                />
                <Row
                    icon={AlertTriangle}
                    tone="alert"
                    label="Expired"
                    value={stats.individualTimers.expired}
                />
            </Panel>

            <Panel title="Group Timers">
                <Row icon={Clock3} tone="focus" label="Active" value={stats.groupTimers.active} />
                <Row
                    icon={CheckCircle2}
                    tone="progress"
                    label="Completed"
                    value={stats.groupTimers.completed}
                />
                <Row
                    icon={AlertTriangle}
                    tone="alert"
                    label="Expired"
                    value={stats.groupTimers.expired}
                />
            </Panel>
        </motion.div>
    );
};

export default CategoryBreakdown;
