import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Users, Brain, Flame } from 'lucide-react';
import { spring } from '@/lib/motion';

const features = [
    { icon: Target, text: 'Set daily focus goals' },
    { icon: Clock, text: 'Track deep work hours' },
    { icon: Trophy, text: 'Compete with friends' },
    { icon: Users, text: 'Join focus challenges' },
    { icon: Brain, text: 'AI productivity tips' },
    { icon: Flame, text: 'Build winning streaks' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.2,
        },
    },
};

const row = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: spring },
};

// Features read as a ledger list, not a grid of decorative cards.
export const FeaturesGrid = () => (
    <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        aria-labelledby="features-heading"
        className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
    >
        <h2
            id="features-heading"
            className="border-b-2 border-ink px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-ink"
        >
            What ProdX Does
        </h2>
        <ul className="divide-y divide-line">
            {features.map(({ icon: Icon, text }) => (
                <motion.li key={text} variants={row} className="flex items-center gap-4 px-5 py-4">
                    <Icon className="h-5 w-5 flex-shrink-0 text-ink-soft" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{text}</span>
                </motion.li>
            ))}
        </ul>
    </motion.section>
);