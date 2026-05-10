import { motion } from 'framer-motion';
import type { ITask } from '../../tasks-card-types';
import TaskItem from '../task-item';

interface TaskListProps {
    tasks: ITask[];
    handleToggleTask: (id: string, isTaskPending: boolean) => void;
}

const TaskList = ({ tasks, handleToggleTask }: TaskListProps) => {
    if (!tasks?.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center"
            >
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                >
                    <span className="text-2xl">✅</span>
                </div>
                <p className="font-black text-slate-700 text-sm">All clear!</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">No tasks for today yet</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-2">
            {tasks.map((task, index) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    index={index}
                    handleToggleTask={handleToggleTask}
                />
            ))}
        </div>
    );
};

export default TaskList;