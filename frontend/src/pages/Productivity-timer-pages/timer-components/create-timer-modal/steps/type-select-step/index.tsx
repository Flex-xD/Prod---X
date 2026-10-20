import { motion } from 'framer-motion';
import { Timer, Users, ChevronRight, Lock } from 'lucide-react';
import type { TimerType } from '../../../types';
import { quick } from '@/lib/motion';

interface TypeSelectStepProps {
    onSelect: (type: TimerType) => void;
    canCreateIndividual: boolean;
    canCreateGroup: boolean;
}

// Tile color is semantic: orange = solo focus session, teal = a
// coordinated (informational) group session. Disabled slots read
// as disabled in text first, color second.
const TYPE_OPTIONS = [
    {
        type: 'individual' as TimerType,
        label: 'Individual Timer',
        desc: 'Solo, distraction-free focus session',
        icon: Timer,
        tile: 'border-focus bg-focus text-ink',
    },
    {
        type: 'group' as TimerType,
        label: 'Group Timer',
        desc: 'Invite up to 5 people and grind together',
        icon: Users,
        tile: 'border-info bg-info text-ink',
    },
];

const TypeSelectStep = ({ onSelect, canCreateIndividual, canCreateGroup }: TypeSelectStepProps) => (
    <motion.div
        key="type-select"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={quick}
        className="space-y-3"
    >
        {TYPE_OPTIONS.map(({ type, label, desc, icon: Icon, tile }) => {
            const disabled = type === 'individual' ? !canCreateIndividual : !canCreateGroup;

            return (
                <button
                    key={type}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onSelect(type)}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all duration-fast ${
                        disabled
                            ? 'cursor-not-allowed border-line bg-paper-deep'
                            : 'border-ink bg-surface shadow-hard-sm hover:-translate-y-px hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs'
                    }`}
                >
                    <span
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border-2 ${
                            disabled ? 'border-line bg-paper text-ink-faint' : tile
                        }`}
                    >
                        {disabled ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-ink">{label}</span>
                        <span className={`mt-0.5 block text-xs ${disabled ? 'text-ink-faint' : 'text-ink-soft'}`}>
                            {disabled ? "You're at your slot limit - free one up first" : desc}
                        </span>
                    </span>

                    {!disabled && <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-faint" aria-hidden="true" />}
                </button>
            );
        })}
    </motion.div>
);

export default TypeSelectStep;