import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { ITask } from '../../tasks-card-types';

interface TaskItemProps {
    task: ITask;
    handleToggleTask: (id: string, isTaskPending: boolean) => void;
    index: number;
}

const TaskItem = ({ task, handleToggleTask, index }: TaskItemProps) => {
    const isDone = task.status === 'done';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', damping: 28, stiffness: 300 }}
            whileHover={isDone ? {} : { y: -2, boxShadow: '0 8px 24px rgba(124,58,237,0.1)' }}
            whileTap={{ scale: 0.985 }}
            onClick={() => handleToggleTask(task._id, task.status === 'pending')}
            className="p-4 rounded-2xl cursor-pointer transition-all"
            style={
                isDone
                    ? { background: '#f0fdf4', border: '1.5px solid #bbf7d0' }
                    : { background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.05)' }
            }
        >
            <div className="flex items-start gap-3">
                {/* Toggle icon */}
                <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    className="flex-shrink-0 mt-0.5"
                >
                    {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                    )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4
                        className="text-sm font-bold leading-snug"
                        style={{ color: isDone ? '#94a3b8' : '#0f172a', textDecoration: isDone ? 'line-through' : 'none' }}
                    >
                        {task.title}
                    </h4>
                    {task.description && (
                        <p className="text-xs mt-0.5 font-medium" style={{ color: isDone ? '#cbd5e1' : '#64748b' }}>
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Done badge */}
                {isDone && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: '#dcfce7', color: '#16a34a' }}
                    >
                        Done ✓
                    </motion.span>
                )}
            </div>
        </motion.div>
    );
};

export default TaskItem;