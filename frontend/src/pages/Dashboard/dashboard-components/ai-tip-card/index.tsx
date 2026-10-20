import { motion } from 'framer-motion';
import SkeletonBlock from '../skeleton-block';
import { spring } from '@/lib/motion';

interface AiTipCardProps {
    tip?: string;
    isLoading: boolean;
}

const AiTipCard = ({ tip, isLoading }: AiTipCardProps) => (
    <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.13 }}
        aria-labelledby="ai-tip-heading"
        className="overflow-hidden rounded-lg border-2 border-ink bg-surface"
    >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3.5">
            <h2 id="ai-tip-heading" className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                AI Tip
            </h2>
            <span className="flex-shrink-0 rounded-sm border border-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                ProdX AI
            </span>
        </div>

        <div className="px-5 py-4">
            {isLoading ? (
                <div className="space-y-2.5">
                    <SkeletonBlock className="h-3.5 w-full" />
                    <SkeletonBlock className="h-3.5 w-4/5" />
                </div>
            ) : tip ? (
                <p className="text-sm font-medium leading-relaxed text-ink">{tip}</p>
            ) : (
                <p className="text-xs font-medium text-ink-faint">No tip for today yet.</p>
            )}
        </div>
    </motion.section>
);

export default AiTipCard;