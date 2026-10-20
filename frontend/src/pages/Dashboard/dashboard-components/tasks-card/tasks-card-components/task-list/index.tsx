import SkeletonBlock from '../../../skeleton-block';
import type { ITask } from '../../tasks-card-types';
import TaskItem from '../task-item';

interface TaskListProps {
    tasks: ITask[];
    handleToggleTask: (id: string, isTaskPending: boolean) => void;
    isLoading?: boolean;
}

const TaskList = ({ tasks, handleToggleTask, isLoading }: TaskListProps) => {
    if (isLoading) {
        return (
            <div className="divide-y divide-line">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-4">
                        <SkeletonBlock className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <SkeletonBlock className="h-3.5 w-2/5" />
                            <SkeletonBlock className="h-3 w-3/5" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!tasks?.length) {
        return (
            <div className="my-2 rounded-lg border-2 border-dashed border-line px-6 py-10 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">No tasks yet</p>
                <p className="mt-1.5 text-xs font-medium text-ink-soft">
                    Add your first task to start today's record.
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-line">
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