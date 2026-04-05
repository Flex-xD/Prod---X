import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateTaskModal from '../create-task-modal';

interface TasksHeaderProps {
    onAddTask: (task: { title: string; description: string; }) => void;
}

const TasksHeader = ({ onAddTask }: TasksHeaderProps) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTask = (title: string, description: string) => {
        const newTaskData = {
            title,
            description,
        };
        onAddTask(newTaskData);
    };

    return (
        <>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Today's Tasks
                        </CardTitle>
                        <p className="text-slate-500 text-sm mt-1">
                            Keep the momentum going! 💪
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </CardHeader>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateTask}
            />
        </>
    );
};

export default TasksHeader;