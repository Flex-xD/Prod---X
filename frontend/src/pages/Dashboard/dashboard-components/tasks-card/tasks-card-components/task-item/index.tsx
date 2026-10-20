import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ITask } from '../../tasks-card-types';
import { quick } from '@/lib/motion';

interface TaskItemProps {
    task: ITask;
    handleToggleTask: (id: string, isTaskPending: boolean) => void;
    index: number;
}

const TaskItem = ({ task, handleToggleTask, index }: TaskItemProps) => {
    const isDone = task.status === 'done';

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...quick, delay: index * 0.04 }}
            onClick={() => handleToggleTask(task._id, task.status === 'pending')}
            aria-pressed={isDone}
            className="flex w-full items-start gap-3 px-1 py-3.5 text-left transition-colors duration-fast hover:bg-paper active:bg-paper-deep"
        >
            {/* Completion mark: green fill is always paired with a check glyph */}
            <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink transition-colors duration-fast ${
                    isDone ? 'bg-progress' : 'bg-transparent'
                }`}
            >
                {isDone && <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} />}
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className={`block text-sm font-semibold leading-snug ${
                        isDone ? 'text-ink-soft line-through' : 'text-ink'
                    }`}
                >
                    {task.title}
                </span>
                {task.description && (
                    <span
                        className={`mt-0.5 block text-xs font-medium ${
                            isDone ? 'text-ink-faint' : 'text-ink-soft'
                        }`}
                    >
                        {task.description}
                    </span>
                )}
            </span>

            {isDone && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={quick}
                    className="flex-shrink-0 rounded-full bg-progress-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-progress-deep"
                >
                    Done
                </motion.span>
            )}
        </motion.button>
    );
};

export default TaskItem;