import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { MagBtn } from '../ui';
import type { ViewMode, IProductivityTimer, IGroupTimer } from '../types';

interface TimerPageHeaderProps {
    view: ViewMode;
    selectedInd: IProductivityTimer | null;
    selectedGrp: IGroupTimer | null;
    onBack: () => void;
    onNewTimer: () => void;
}

const SUBTITLES: Record<ViewMode, string> = {
    'dashboard': 'Track your sessions',
    'individual-detail': 'Individual Session',
    'group-detail': 'Group Session',
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
        view === 'dashboard' ? 'Focus Timers' :
            view === 'individual-detail' ? (selectedInd?.title ?? 'Timer') :
                (selectedGrp?.title ?? 'Group Timer');

    return (
        <div
            className="sticky top-0 z-40"
            style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: back + title */}
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {view !== 'dashboard' && (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onClick={onBack}
                                whileHover={{ x: -2 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-2xl flex items-center justify-center transition-colors text-slate-500 hover:text-slate-900 bg-slate-50"
                                style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div>
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={view}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.2 }}
                                className="text-xl font-black text-slate-900"
                            >
                                {title}
                            </motion.h1>
                        </AnimatePresence>
                        <p className="text-slate-400 text-xs font-semibold">{SUBTITLES[view]}</p>
                    </div>
                </div>

                {/* Right: new timer button (dashboard only) */}
                {view === 'dashboard' && (
                    <MagBtn
                        onClick={onNewTimer}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold"
                        style={{
                            background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                            boxShadow: '0 6px 20px rgba(124,58,237,0.38)',
                        }}
                    >
                        <Plus className="w-4 h-4" /> New Timer
                    </MagBtn>
                )}
            </div>
        </div>
    );
};

export default TimerPageHeader;