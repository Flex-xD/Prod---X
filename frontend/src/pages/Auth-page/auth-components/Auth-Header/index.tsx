import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { spring } from '@/lib/motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: spring },
};

export const AuthHeader = () => (
    <motion.header
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row"
    >
        <motion.div variants={item} className="flex items-center gap-3">
            <span
                aria-hidden="true"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-ink text-paper"
            >
                <Zap className="h-5 w-5" />
            </span>
            <div>
                <h1 className="text-3xl font-bold leading-none tracking-tight text-ink">ProdX</h1>
                <p className="mt-1 text-sm font-medium text-ink-soft">Your record of focused work</p>
            </div>
        </motion.div>

        <motion.div variants={item}>
            <Link
                to="/"
                className="inline-flex items-center rounded-lg border-2 border-ink bg-surface px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
            >
                Back to site
            </Link>
        </motion.div>
    </motion.header>
);