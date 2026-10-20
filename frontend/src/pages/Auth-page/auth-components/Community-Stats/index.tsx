import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';

// Honest content: describes what the product tracks instead of
// inventing user counts, hours or success percentages.
const cells = [
    { label: 'Tasks', text: 'Plan and finish each day' },
    { label: 'Focus', text: 'Deep-work hours, tracked' },
    { label: 'Streaks', text: 'Days you kept going' },
];

export const CommunityStats = () => (
    <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.1 }}
        aria-labelledby="record-heading"
        className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
    >
        <div className="border-b-2 border-ink px-5 py-3.5">
            <h2 id="record-heading" className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                Your Record
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-ink-faint">
                Everything you do in ProdX lands on one page
            </p>
        </div>
        <div className="grid grid-cols-1 divide-y-2 divide-line sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            {cells.map(({ label, text }) => (
                <div key={label} className="flex flex-col gap-1.5 p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                        {label}
                    </span>
                    <span className="text-xs font-medium text-ink-soft">{text}</span>
                </div>
            ))}
        </div>
    </motion.section>
);