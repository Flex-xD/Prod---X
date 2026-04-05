export interface ITask {
    title: string;
    description?: string;
}

export interface TasksCardProps {
    tasks: ITask[];
    onToggleTask: (id: number) => void;
    onAddTask: (taskData:ITask) => void; 
    createTaskPending:boolean;
}
