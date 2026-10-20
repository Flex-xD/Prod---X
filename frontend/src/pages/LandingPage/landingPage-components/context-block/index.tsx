import { motion } from 'framer-motion';
import { quick } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { Skeleton, useReadyAfter } from '../shared';

const TIP =
    'Two tasks are still open and there is no focus session yet today. Start with 25 minutes on the shorter task to keep today’s square filled.';
const SUMMARY = 'You have finished 2 of 4 tasks and focused for 1h 25m so far today.';

function Block({
    title,
    chip,
    text,
    foot,
    className,
}: {
    title: string;
    chip?: string;
    text: string;
    foot?: string;
    className?: string;
}) {
    const { ref, ready } = useReadyAfter<HTMLElement>(900);
    return (
        <section ref={ref} aria-label={title} className={className}>
            <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3 sm:px-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em]">{title}</h3>
                {chip && (
                    <span className="shrink-0 rounded-sm border border-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {chip}
                    </span>
                )}
            </div>
            <div className="px-4 py-4 sm:px-6">
                {ready ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={quick} className="text-sm font-medium leading-relaxed">
                        {text}
                    </motion.p>
                ) : (
                    <div className="space-y-2.5">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-4/5" />
                    </div>
                )}
                {foot && <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-info-deep">{foot}</p>}
            </div>
        </section>
    );
}

export const AiTipBlock = ({ className }: { className?: string }) => (
    <Block title="AI tip" chip="ProdX AI" text={TIP} className={cn('bg-surface', className)} />
);

export const DaySummaryBlock = ({ className }: { className?: string }) => (
    <Block title="Your day so far" text={SUMMARY} foot="Updates as you go" className={cn('bg-info-tint', className)} />
);