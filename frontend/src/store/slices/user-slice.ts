import type { StateCreator } from "zustand"

export interface IUserSlice {
    user_id:string | undefined , 
    setUserId:(user_id:string) => void
}

export const userSlice:StateCreator<IUserSlice> = (set) => ({
    user_id:undefined , 
    setUserId:(user_id:string) => {
        set({user_id})
    }
})