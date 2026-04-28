import type { ITask } from "../../tasks-card-types";
import TaskItem from "../task-item";

interface TaskListProps {
    tasks: ITask[];
    onToggleTask: (id: string) => void;
}

const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
    return (
        <>
            {tasks.map((task, index) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    index={index}
                    onToggle={onToggleTask}
                />
            ))}
        </>
    );
};

export default TaskList;
