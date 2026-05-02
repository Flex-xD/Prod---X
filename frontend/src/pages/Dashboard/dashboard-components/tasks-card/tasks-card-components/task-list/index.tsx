import { CardTitle } from "@/components/ui/card";
import type { ITask } from "../../tasks-card-types";
import TaskItem from "../task-item";

interface TaskListProps {
    tasks: ITask[];
    handleToggleTask: (id: string , isTaskPending:boolean) => void;
}

const TaskList = ({ tasks, handleToggleTask }: TaskListProps) => {
    return (
        <>{tasks !== undefined || null ?
            tasks.map((task, index) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    index={index}
                    handleToggleTask={handleToggleTask}
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
