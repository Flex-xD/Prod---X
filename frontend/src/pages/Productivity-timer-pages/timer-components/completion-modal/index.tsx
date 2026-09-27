import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X } from 'lucide-react';
import { softSp } from '../constants';

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
            <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{ background: 'rgba(15,10,40,0.65)', backdropFilter: 'blur(12px)' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                <motion.div
                    className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden z-10 text-center p-8"
                    style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={softSp}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>

                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 12px 32px rgba(124,58,237,0.4)' }}
                    >
                        <PartyPopper className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{message}</p>

                    <div className="flex flex-col gap-2.5">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            disabled={primaryPending}
                            onClick={onPrimary}
                            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
                        >
                            {primaryPending ? 'Working...' : primaryLabel}
                        </motion.button>

                        {secondaryLabel && onSecondary && (
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={onSecondary}
                                className="w-full py-3 rounded-2xl font-bold text-sm text-slate-500"
                                style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)' }}
                            >
                                {secondaryLabel}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default CompletionModal;