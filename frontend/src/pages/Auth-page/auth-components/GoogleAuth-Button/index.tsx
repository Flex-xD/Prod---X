import GoogleAuthLogin from "../Google-Auth";

type GoogleAuthButtonProps = {
    onSuccess: (credential: any) => void;
};

export const GoogleAuthButton = ({ onSuccess }: GoogleAuthButtonProps) => (
    <div className="flex justify-center">
        <GoogleAuthLogin handleGoogleLogin={onSuccess} />
    </div>
);