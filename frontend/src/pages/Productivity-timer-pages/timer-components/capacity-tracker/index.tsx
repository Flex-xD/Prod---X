import { motion } from 'framer-motion';
import { cellFill } from '@/lib/motion';

interface CapacityTrackerProps {
    used: number;
    max: number;
}

// Slot segments are grid cells: each filled slot pops in with
// cellFill on arrival, and re-fills through a CSS color transition
// when a timer is created or archived. Orange = slots in active use.
const CapacityTracker = ({ used, max }: CapacityTrackerProps) => (
    <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: {} }}
        className="mb-6 rounded-lg border-2 border-ink bg-surface px-4 py-3.5"
    >
        {/* Label row */}
        <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            <span>Session Slots</span>
            <span className={`font-mono tabular-nums ${used >= max ? 'text-alert-deep' : 'text-ink'}`}>
                {used}/{max}
            </span>
        </div>

        {/* Slot segments */}
        <div className="flex gap-1.5" role="img" aria-label={`${used} of ${max} slots used`}>
            {Array.from({ length: max }).map((_, i) => (
                <motion.span
                    key={i}
                    variants={cellFill}
                    custom={i * 0.04}
                    aria-hidden="true"
                    className={`h-2 flex-1 rounded-sm transition-colors duration-base ${
                        i < used ? 'bg-focus' : 'bg-paper-deep'
                    }`}
                />
            ))}
        </div>

        {/* "Slots Full" warning pill */}
        {used >= max && (
            <span className="mt-3 inline-block rounded-full border border-alert bg-alert-tint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-alert-deep">
                Slots Full
            </span>
        )}
    </motion.div>
);

export default CapacityTracker;