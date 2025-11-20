import mongoose, { Model } from "mongoose";
import { taskSchemaType } from "../schema/task-schema";

export interface TaskModel extends mongoose.Document, Omit<taskSchemaType, "_id"> {}
const taskSchema = new mongoose.Schema<TaskModel>({
    author:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"User"
    } ,
    title:{
        type:String , 
        required:true  
    } ,
    description:{
        type:String , 
        required:false 
    } , 
    status:{
        type:String , 
        enum:["pending" , "in-progress"  , "completed"]
    } 
} , {
    timestamps:true
})

const Task : Model<TaskModel> = mongoose.model<TaskModel>("Task" , taskSchema);
export default Task;