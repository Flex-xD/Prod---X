export interface ITask {
    id: number;
    title: string;
    description?: string;
    done: boolean;
}

export interface TasksCardProps {
    tasks: ITask[];
    onToggleTask: (id: number) => void;
    onAddTask: () => void;
}
