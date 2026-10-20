import { GoogleLogin } from '@react-oauth/google';


const GoogleAuthLogin = ({ handleGoogleLogin }: any) => (
    <GoogleLogin
        theme="filled_black"
        onSuccess={handleGoogleLogin}
        onError={() => console.log('Error while logging with google ')}
    />
);

export default GoogleAuthLogin;