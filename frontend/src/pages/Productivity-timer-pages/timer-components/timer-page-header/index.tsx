import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { PressBtn } from '../ui';
import { quick } from '@/lib/motion';
import type { ViewMode, IProductivityTimer, IGroupTimer } from '../types';

interface TimerPageHeaderProps {
    view: ViewMode;
    selectedInd: IProductivityTimer | null;
    selectedGrp: IGroupTimer | null;
    onBack: () => void;
    onNewTimer: () => void;
}

const SUBTITLES: Record<ViewMode, string> = {
    dashboard: 'Track your sessions',
    'individual-detail': 'Individual session',
    'group-detail': 'Group session',
};

const TimerPageHeader = ({
    view,
    selectedInd,
    selectedGrp,
    onBack,
    onNewTimer,
}: TimerPageHeaderProps) => {
    // Dynamic title based on active view
    const title =
        view === 'dashboard'
            ? 'Focus Timers'
            : view === 'individual-detail'
              ? (selectedInd?.title ?? 'Timer')
              : (selectedGrp?.title ?? 'Group Timer');

    return (
        <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
                {/* Left: back + title */}
                <div className="flex min-w-0 items-center gap-3">
                    <AnimatePresence>
                        {view !== 'dashboard' && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={quick}
                                onClick={onBack}
                                aria-label="Back to timers"
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-surface text-ink-soft shadow-hard-xs transition-all duration-fast hover:text-ink hover:shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={view}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={quick}
                                className="truncate text-lg font-bold tracking-tight text-ink"
                            >
                                {title}
                            </motion.h1>
                        </AnimatePresence>
                        <p className="text-xs font-medium text-ink-faint">{SUBTITLES[view]}</p>
                    </div>
                </div>

                {/* Right: new timer button (dashboard only). Orange = active focus. */}
                {view === 'dashboard' && (
                    <PressBtn variant="focus" onClick={onNewTimer} className="flex-shrink-0 py-2">
                        <Plus className="h-4 w-4" aria-hidden="true" /> New Timer
                    </PressBtn>
                )}
            </div>
        </header>
    );
};

export default TimerPageHeader;