

export type ITask  = {
    title:string , 
    body:string , 
    status:'done' | 'pending' , 
    point:number
}

const handlers = {
    taskHandlers:{
        "task.created":async (task:ITask) => {

        } , 
        "task.mark.done" :async () => {

        }  
        
    }
};

export default handlers;