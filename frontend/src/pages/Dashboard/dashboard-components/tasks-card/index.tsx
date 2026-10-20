import { motion } from 'framer-motion';
import { spring, progressUpdate } from '@/lib/motion';
import type { TasksCardProps } from './tasks-card-types';
import TasksHeader from './tasks-card-components/task-header';
import TaskList from './tasks-card-components/task-list';

const TasksCard = ({
    tasks,
    handleToggleTask,
    onAddTask,
    createTaskPending,
    isLoading,
}: TasksCardProps) => {
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    const pct = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard"
        >
            <TasksHeader onAddTask={onAddTask} createTaskPending={createTaskPending} />

            {/* Progress rule under header */}
            {tasks.length > 0 && (
                <div className="px-6 pb-4">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        <span>Progress</span>
                        <span className="font-mono tabular-nums text-progress-deep">
                            {doneCount}/{tasks.length} done
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-sm bg-paper-deep">
                        <motion.div
                            className="h-full rounded-sm bg-progress"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={progressUpdate}
                        />
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="mx-6 h-px bg-line" />

            {/* Task list */}
            <div className="px-6 pb-4 pt-1">
                <TaskList tasks={tasks} handleToggleTask={handleToggleTask} isLoading={isLoading} />
            </div>
        </motion.div>
    );
};

export default TasksCard;