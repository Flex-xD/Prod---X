import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { spring } from '@/lib/motion';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string) => void;
    createTaskPending: boolean;
}

const CreateTaskModal = ({ isOpen, onClose, onCreate, createTaskPending }: CreateTaskModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreate(title.trim(), description.trim());
            setTitle('');
            setDescription('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-ink/60"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={spring}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-task-title"
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') onClose();
                        }}
                        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-ink bg-surface p-6 shadow-hard-lg"
                    >
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="create-task-title"
                                    className="text-sm font-bold uppercase tracking-[0.14em] text-ink"
                                >
                                    Create Task
                                </h2>
                                <p className="mt-1 text-xs font-medium text-ink-faint">
                                    It joins today's record.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="-m-1.5 rounded-sm p-1.5 text-ink-soft transition-colors duration-fast hover:bg-paper-deep hover:text-ink"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="create-task-title-input"
                                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                                >
                                    Title <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="create-task-title-input"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What did you sit down to do?"
                                    className="w-full rounded-sm border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="create-task-description"
                                    className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft"
                                >
                                    Description{' '}
                                    <span className="font-medium normal-case text-ink-faint">(optional)</span>
                                </label>
                                <textarea
                                    id="create-task-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add details"
                                    rows={3}
                                    className="w-full resize-none rounded-sm border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink transition-colors duration-fast placeholder:text-ink-faint focus:bg-surface"
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-lg border-2 border-ink bg-surface px-4 py-2.5 text-sm font-bold text-ink shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTaskPending}
                                    aria-busy={createTaskPending}
                                    className="flex-1 rounded-lg border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold text-paper shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;