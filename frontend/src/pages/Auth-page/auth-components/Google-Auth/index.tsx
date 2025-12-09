import { GoogleLogin } from "@react-oauth/google"


const GoogleAuthLogin = ({handleGoogleLogin}:any) => {
    return (
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Error while logging with google ")} />
    )
}

export default GoogleAuthLogin;