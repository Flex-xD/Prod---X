import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateTaskModal from '../create-task-modal';

interface TasksHeaderProps {
    onAddTask: (task: { title: string; description: string }) => void;
    createTaskPending: boolean;
}

const TasksHeader = ({ onAddTask, createTaskPending }: TasksHeaderProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTask = (title: string, description: string) => {
        onAddTask({ title, description });
    };

    return (
        <>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
                            Today's Tasks
                        </CardTitle>
                        <p className="mt-1 text-xs font-medium text-ink-faint">
                            A finished task keeps today's streak alive.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        disabled={createTaskPending}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-paper shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs disabled:pointer-events-none disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add Task
                    </button>
                </div>
            </CardHeader>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateTask}
                createTaskPending={createTaskPending}
            />
        </>
    );
};

export default TasksHeader;