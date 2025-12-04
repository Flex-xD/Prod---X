import mongoose  ,{Model} from "mongoose";


export interface ITimer extends mongoose.Document {
    _id:mongoose.Types.ObjectId , 
    title:string , 
    body:string , 
    // ? see if setting the below timer to Date is good or find a way to set it to time 
    specifiedTime:Number , 
    deadline:Date , 
    completedTime:number | null ,
    isCompleted:boolean , 
    author:mongoose.Types.ObjectId
}

const timerSchema = new mongoose.Schema<ITimer>({
    title:{
        type:String , 
        required:true ,
    } , 
    body:{
        type:String , 
        required:false ,
    } , 
    specifiedTime:{
        type:Number ,
        required:true , 
    } , 
    deadline:{
        type:Date , 
        required:true , 
    } , 
    completedTime:{
        type:Number ,
        default:null ,
    } , 
    isCompleted:{
        type:Boolean , 
        default:false ,
    } , 
    author:{
        type:mongoose.Schema.Types.ObjectId
    }
} , {
    timestamps:true ,
})

const Timer:Model<ITimer> = mongoose.model<ITimer>("Timer" , timerSchema);
export default Timer;