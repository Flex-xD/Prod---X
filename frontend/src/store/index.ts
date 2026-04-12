import {create} from "zustand";
import { authSlice } from "./slices/auth-slice";
import type { IAuthState } from "./slices/auth-slice";
import { tokenSlice, type ITokenState } from "./slices/token-slice";

type IAppState = IAuthState & ITokenState

export const userAppStore = create<IAppState>()(
    (set , get , store) => ({
        ...authSlice(set , get , store), 
        ...tokenSlice(set , get ,store)
    })
)