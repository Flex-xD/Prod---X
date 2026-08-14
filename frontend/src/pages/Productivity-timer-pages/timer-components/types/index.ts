export type TimerType = 'individual' | 'group';
export type ModalStep = 'type-select' | 'invite-users' | 'fill-details';
export type ViewMode = 'dashboard' | 'individual-detail' | 'group-detail';

export interface IUser {
    _id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
}

export interface IProductivityTimer {
    id: string;
    title: string;
    description: string;
    deadline: string;
    specifiedTime: number;
    productivityDone: number;
    isActive: boolean;
    createdAt: string;
}

export interface IGroupParticipant {
    user: IUser;
    productivityDone: number;
    isCurrentlyActive: boolean;
    rank: number;
}

export interface IGroupTimer {
    id: string;
    title: string;
    description: string;
    deadline: string;
    specifiedTime: number;
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
    title:string , 
    description:string , 
    deadline:string , 
    // ? Guesss what this specifiedTime could be 
    specifiedTime:number , 
    invitedUsersId:string[]
}