import { CardTitle } from "@/components/ui/card";
import type { ITask } from "../../tasks-card-types";
import TaskItem from "../task-item";

interface TaskListProps {
    tasks: ITask[];
    onToggleTask: (id: string) => void;
}

const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
    return (
        <>{tasks == undefined || null ?
            tasks.map((task, index) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    index={index}
                    onToggle={onToggleTask}
                />
            )) :
            <div>
                <CardTitle className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    No tasks for today . . .
                </CardTitle>
            </div>}
        </>
    );
};

export default TaskList;
