export interface IUser {
    _id:string ,
    username:string , 
    email:string , 
    provider:string ,
    avatar:string , 
    refreshTokens:string[] , 
    userTasks:string[] ,
    userProductivityTimer:string[]
    // Omit the password from the backend
}