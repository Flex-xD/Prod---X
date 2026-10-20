export interface ITaskData {
    title: string;
    description?: string;
}

export interface ITask {
    _id: string;
    title: string;
    description?: string;
    author: string;
    status: "pending" | "in-progress" | "done";
    createdAt: Date;
    updatedAt: Date;
    // Virtual field (populated later)
    authorDetails?: {
        _id: string,
        username: string;
        avatar?: string;
    };
}

export interface TasksCardProps {
    tasks: ITask[];
    handleToggleTask: (taskId: string, isTaskPending: boolean) => void;
    onAddTask: (taskData: ITaskData) => void;
    createTaskPending: boolean;
    onToggleTaskPending: boolean;
    isLoading?: boolean;
}