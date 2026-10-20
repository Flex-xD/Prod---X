import { motion } from 'framer-motion';
import SkeletonBlock from '../skeleton-block';
import { spring } from '@/lib/motion';

interface ActivityMessageCardProps {
    message?: string;
    isLoading: boolean;
}

// Information semantics: this card is context about your day, so it uses the
// blue-green tint rather than competing with progress green or focus orange.
const ActivityMessageCard = ({ message, isLoading }: ActivityMessageCardProps) => (
    <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.18 }}
        aria-labelledby="activity-message-heading"
        className="overflow-hidden rounded-lg border-2 border-ink bg-info-tint"
    >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3.5">
            <h2
                id="activity-message-heading"
                className="text-sm font-bold uppercase tracking-[0.12em] text-ink"
            >
                Your Day So Far
            </h2>
        </div>

        <div className="px-5 py-4">
            {isLoading ? (
                <div className="space-y-2.5">
                    <SkeletonBlock className="h-3.5 w-full" />
                    <SkeletonBlock className="h-3.5 w-3/5" />
                </div>
            ) : message ? (
                <p className="text-sm font-medium leading-relaxed text-ink">{message}</p>
            ) : (
                <p className="text-xs font-medium text-ink-soft">
                    Nothing recorded yet. Your day will show up here as you work.
                </p>
            )}
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-info-deep">
                Updates as you go
            </p>
        </div>
    </motion.section>
);

export default ActivityMessageCard;