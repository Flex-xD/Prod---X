export type TimerType = 'individual' | 'group';
export type ModalStep = 'type-select' | 'invite-users' | 'fill-details';
export type ViewMode = 'dashboard' | 'individual-detail' | 'group-detail';

export interface IUser {
    provider: string;
    email: ReactNode;
    _id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
}

export interface IProductivityTimer {
    _id: string;
    title: string;
    description?: string;
    specifiedTime: number;
    isActive: boolean;
    deadline: string;
    status: string;
    author: { _id: string; username: string; avatar: string; isOnline: boolean };
    completedTime: number;
    createdAt: string;
    updatedAt: string;
}

export interface IGroupParticipant {
    user: IUser;
    username:String
    productivityDone: number;
    isCurrentlyActive: boolean;
    rank: number;
    hasCompleted: boolean;
    archived: boolean;
}

export interface IGroupTimer {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    specifiedTime: number;
    invitedUsersId: string[];
    status: 'pending' | 'done';
    isActive: boolean;
    participants: IGroupParticipant[];
    author: IUser;
    isJoined: boolean;
}

export interface ITimerForm {
    title: string;
    description: string;
    deadline: string;
    specifiedTime: number;
}

export interface IGroupTimerForm {
    title: string;
    description: string;
    deadline: string;
    specifiedTime: number;
    invitedUsersId: string[];
}