import User from "../models/User"


export const authService = {
    findOrCreateGoogleUser: async (googleUser: any) => {
        let user = await User.findById({ email: googleUser.email });
        if (!user) {
            user = await User.create({
                username: googleUser.name,
                email: googleUser.email,
                userTodos:[] ,
                provider: "google",
                avatar: googleUser.profilePicture
            })
        }
        return user;
    },
    registerLocalUser: async () => {
        // remember to put provider:local
        // I also have to set jwt system
    },
    loginLocalUser: async () => {

    }
}