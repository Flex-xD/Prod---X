import {
    Timer,
    Clock,
    Target,
    Calendar,
    AlertTriangle,
} from 'lucide-react';

import { Pill, SlimBar } from '../ui';

import {
    formatSeconds,
    formatMinutes,
    progressPercent,
    isExpired,
} from '../utils';

import type { IProductivityTimer } from '../types';

interface IndividualTimerCardProps {
    timer: IProductivityTimer;
    index?: number;
    onClick: () => void;
}

// Static arrival (the section enters once); hover and press are
// CSS-only, and the percent bar eases through progressUpdate.
const IndividualTimerCard = ({ timer, onClick }: IndividualTimerCardProps) => {
    const completedTime = timer.completedTime ?? 0;
    const pct = progressPercent(completedTime, timer.specifiedTime);
    const expired = isExpired(timer.deadline);
    const description = timer.description?.trim() || 'No description provided';

    const formattedDeadline = new Date(timer.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className="cursor-pointer overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard transition-all duration-fast hover:-translate-y-px hover:shadow-hard-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard"
        >
            <div className="p-5">
                <div className="mb-4 flex items-start gap-3">
                    {/* Timer icon: tint encodes state, not personality */}
                    <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 ${
                            expired
                                ? 'border-alert bg-alert-tint text-alert-deep'
                                : timer.isActive
                                  ? 'border-focus bg-focus-tint text-focus-deep'
                                  : 'border-line bg-paper-deep text-ink-soft'
                        }`}
                    >
                        <Timer className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate text-sm font-bold text-ink">{timer.title}</h4>

                            {expired ? (
                                <Pill color="alert">
                                    <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Expired
                                </Pill>
                            ) : (
                                <>
                                    {timer.status === 'pending' && <Pill color="focus">Pending</Pill>}
                                    {timer.isActive && <Pill color="focus">Active</Pill>}
                                </>
                            )}
                        </div>

                        <p className="mt-0.5 truncate text-xs font-medium text-ink-faint" title={description}>
                            {description}
                        </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <span className="font-mono text-2xl font-bold tabular-nums text-ink">{pct}</span>
                        <span className="text-sm font-bold text-ink-faint">%</span>
                    </div>
                </div>

                <SlimBar percent={pct} height={4} />

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-ink-faint">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span className="font-mono tabular-nums">{formatSeconds(completedTime)}</span>
                    </span>

                    <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" aria-hidden="true" />
                        {formatMinutes(timer.specifiedTime)}
                    </span>

                    <span className="flex items-center gap-1" title={timer.deadline}>
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {formattedDeadline}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default IndividualTimerCard;