import type { StateCreator } from "zustand";

export interface ITokenState {
    accessToken:undefined  | string, 
    setAccessToken:(token:string) => void;  
    clearAccessToken:() => void;
}

export const tokenSlice:StateCreator<ITokenState> = (set) => ({
    accessToken:undefined , 
    setAccessToken:(token) => {
        set({accessToken:token});
    } , 
    clearAccessToken:() => {
        set({accessToken:undefined})
    }
})