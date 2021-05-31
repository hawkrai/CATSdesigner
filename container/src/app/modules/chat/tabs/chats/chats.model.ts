import { Groups } from '../groups/groups.model';
export class Chat {
    id?: number;
    name: string;
    profilePicture?: string;
    status?: string;
    lastMessage?: string;
    time: string;
    unread: number;
    isActive?: boolean;
    isTyping?: boolean;
    isGroup?:boolean;
    userId?:number;
}
