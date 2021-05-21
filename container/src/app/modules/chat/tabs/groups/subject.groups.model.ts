import { Groups } from './groups.model';
import { Chats } from '../chats/chats.model';
export interface SubjectGroups {
    id: number;
    name: string;
    unread: number;
    groups?: Chats[];
}