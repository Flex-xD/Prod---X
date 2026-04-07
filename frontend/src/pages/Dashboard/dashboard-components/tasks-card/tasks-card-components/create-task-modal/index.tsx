import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string) => void; 
    createTaskPending:boolean
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl border-0 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Create New Task
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Write a title..."
                                        className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none transition-colors"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add some details..."
                                        rows={3}
                                        className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        variant="outline"
                                        className="flex-1 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={createTaskPending}
                                        type="submit"
                                        className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        Create Task
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;