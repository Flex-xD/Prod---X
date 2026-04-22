import { create } from "zustand";
import { authSlice } from "./slices/auth-slice";
import type { IAuthState } from "./slices/auth-slice";
import { persist } from "zustand/middleware";
import { tokenSlice, type ITokenState } from "./slices/token-slice";

type IAppState = IAuthState & ITokenState

export const userAppStore = create<IAppState>()(
    persist(
        (set, get, store) => ({
            ...authSlice(set, get, store),
            ...tokenSlice(set, get, store)
        })  , 
        {
            name:'auth-storage', 
            partialize:((state) => ({
                isAuthenticated:state.isAuthenticated , 
                accessToken:state.accessToken
            }))
        }
    )
)