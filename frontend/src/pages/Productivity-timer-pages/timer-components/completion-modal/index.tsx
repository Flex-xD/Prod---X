import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { quick, spring } from '@/lib/motion';
import { PressBtn } from '../ui';

interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    primaryLabel: string;
    onPrimary: () => void;
    primaryPending?: boolean;
    secondaryLabel?: string;
    onSecondary?: () => void;
}

const CompletionModal = ({
    isOpen, onClose, title, message,
    primaryLabel, onPrimary, primaryPending,
    secondaryLabel, onSecondary,
}: CompletionModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop: flat ink scrim, no blur (foundation: no glass) */}
                <motion.div
                    className="fixed inset-0 z-[60] bg-ink/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={quick}
                    onClick={onClose}
                    aria-hidden="true"
                />

                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="completion-title"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={spring}
                    className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-ink bg-surface p-8 text-center shadow-hard-lg"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="absolute right-3 top-3 rounded-sm p-1.5 text-ink-soft transition-colors duration-fast hover:bg-paper-deep hover:text-ink"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Achievement block: green means completion here */}
                    <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-ink bg-progress text-ink shadow-hard-sm">
                        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                    </span>

                    <h3 id="completion-title" className="text-base font-bold uppercase tracking-[0.14em] text-ink">
                        {title}
                    </h3>
                    <p className="mb-6 mt-2 text-sm font-medium leading-relaxed text-ink-soft">{message}</p>

                    <div className="flex flex-col gap-2.5">
                        <PressBtn variant="success" disabled={primaryPending} onClick={onPrimary} className="w-full py-3.5">
                            {primaryPending ? 'Working...' : primaryLabel}
                        </PressBtn>

                        {secondaryLabel && onSecondary && (
                            <PressBtn variant="secondary" onClick={onSecondary} className="w-full py-3">
                                {secondaryLabel}
                            </PressBtn>
                        )}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

export default CompletionModal;