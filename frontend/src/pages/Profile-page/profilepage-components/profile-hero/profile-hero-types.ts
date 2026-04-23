export interface IProfileHeroProps {
    username: string;
    email: string;
    avatarUrl: string;
    friendsCount: number;
    productivityPoints: number;
    onSave: (data: IProfileEditPayload) => void;
    onLogout: () => void;
    isLogoutPending:boolean
}

export interface IProfileEditPayload {
    username: string;
    avatarFile: File | null;
    avatarPreview: string;
}