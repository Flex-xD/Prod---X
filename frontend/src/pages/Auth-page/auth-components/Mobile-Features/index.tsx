import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Users } from 'lucide-react';
import { spring } from '@/lib/motion';

const features = [
    { icon: Target, text: 'Set daily focus goals' },
    { icon: Clock, text: 'Track deep work hours' },
    { icon: Trophy, text: 'Compete with friends' },
    { icon: Users, text: 'Join focus challenges' },
];

export const MobileFeatures = ({ className = '' }: { className?: string }) => (
    <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className={className}
        aria-labelledby="mobile-features-heading"
    >
        <h2
            id="mobile-features-heading"
            className="mb-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-ink"
        >
            Why ProdX?
        </h2>
        <ul className="divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-surface">
            {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 px-5 py-4">
                    <Icon className="h-5 w-5 flex-shrink-0 text-ink-soft" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{text}</span>
                </li>
            ))}
        </ul>
    </motion.section>
);