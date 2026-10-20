import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';

const quotes = [
    'Every focused hour brings you closer to your goals',
    'Great things are done by a series of small things brought together',
    "Productivity is never an accident. It's the result of commitment to excellence",
    'The secret of getting ahead is getting started',
    "Don't count the days, make the days count",
];

// A calm note on paper, not a hero banner: no gradients, no looping motion.
export const MotivationalQuote = () => {
    const todayQuote = quotes[new Date().getDate() % quotes.length];
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <motion.figure
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            aria-labelledby="quote-heading"
            className="rounded-lg border-2 border-ink bg-paper p-8 shadow-hard"
        >
            <figcaption className="mb-4 flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
                <h2
                    id="quote-heading"
                    className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                    Today's Note
                </h2>
                <span className="font-mono text-[11px] uppercase text-ink-faint">{today}</span>
            </figcaption>
            <blockquote className="text-lg font-medium leading-relaxed text-ink">
                <span aria-hidden="true" className="mr-1 font-mono text-2xl text-ink-faint">
                    &ldquo;
                </span>
                {todayQuote}
            </blockquote>
        </motion.figure>
    );
};