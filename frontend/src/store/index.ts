import {create} from "zustand";
import { authSlice } from "./slices/auth-slice";
import type { IAuthState } from "./slices/auth-slice";

type IAppState = IAuthState

export const userAppStore = create<IAppState>()(
    (set , get , store) => ({
        ...authSlice(set , get , store)
    })
)