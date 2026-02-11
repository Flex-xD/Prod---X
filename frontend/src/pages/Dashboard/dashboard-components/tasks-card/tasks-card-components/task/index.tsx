import type { ITask } from "../..";


export const Task = ({ id, title, description, done, onToggleTask }: ITask) => {
    console.log(id , title , description , done, onToggleTask);
    return (
        <div>
            
        </div>
    )
}