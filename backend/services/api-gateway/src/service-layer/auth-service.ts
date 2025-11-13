import { email } from "zod"
import User from "../models/User"

export const authService = {
    findOrCreateGoogleUser: async (googleUser:any) => {
        const user = await User.findById({email:googleUser.email});
        if (!user) {
            const user = await User.create()
        }
    }
}