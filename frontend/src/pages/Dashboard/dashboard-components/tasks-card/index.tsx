import { motion } from 'framer-motion';
import type { TasksCardProps } from './tasks-card-types';
import TasksHeader from './tasks-card-components/task-header';
import TaskList from './tasks-card-components/task-list';

const TasksCard = ({
    tasks,
    handleToggleTask,
    onAddTask,
    createTaskPending,
    onToggleTaskPending,
}: TasksCardProps) => {
    const doneCount = tasks.filter(t => t.status === 'done').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, type: 'spring', damping: 28, stiffness: 280 }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            <TasksHeader onAddTask={onAddTask} createTaskPending={createTaskPending} />

            {/* Progress bar under header */}
            {tasks.length > 0 && (
                <div className="px-6 pb-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                        <span>Progress</span>
                        <span style={{ color: '#7c3aed' }}>{doneCount}/{tasks.length} done</span>
                    </div>
                    <div
                        className="w-full rounded-full overflow-hidden"
                        style={{ height: 4, background: 'rgba(0,0,0,0.05)' }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#7C3AED,#4F46E5)' }}
                            initial={{ width: 0 }}
                            animate={{ width: tasks.length > 0 ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
                            transition={{ duration: 1, ease: [0.34, 1.2, 0.64, 1] }}
                        />
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="mx-6 h-px" style={{ background: 'rgba(0,0,0,0.04)' }} />

            {/* Task list */}
            <div className="px-4 pb-4 pt-3">
                <TaskList tasks={tasks} handleToggleTask={handleToggleTask} />
            </div>
        </motion.div>
    );
};

export default TasksCard;