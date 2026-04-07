export interface IHandleLogin {
    email: string,
    password: string
}

export interface IHandleRegiser extends IHandleLogin {
    username: string
    confirmPassword:string
}