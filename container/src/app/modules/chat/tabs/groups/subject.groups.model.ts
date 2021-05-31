import { Groups } from './groups.model';
import { Chat } from '../chats/chats.model';
export interface SubjectGroups {
    id: number;
    name: string;
    unread: number;
    groups?: Chat[];
}