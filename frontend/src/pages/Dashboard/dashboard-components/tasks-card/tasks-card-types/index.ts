export interface ITaskData {
    title: string;
    description?: string;
}

export interface ITask extends ITaskData {
    status:"pending" | "in-progress" | "done"
}

export interface TasksCardProps {
    tasks: ITaskData[];
    onToggleTask: (id: number) => void;
    onAddTask: (taskData:ITaskData) => void; 
    createTaskPending:boolean;
}
