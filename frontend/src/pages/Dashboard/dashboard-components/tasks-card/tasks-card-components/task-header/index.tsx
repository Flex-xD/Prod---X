import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TasksHeaderProps {
    onAddTask: () => void;
}

const TasksHeader = ({ onAddTask }: TasksHeaderProps) => {
    return (
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
                    onClick={onAddTask}
                    className="bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>
        </CardHeader>
    );
};

export default TasksHeader;
