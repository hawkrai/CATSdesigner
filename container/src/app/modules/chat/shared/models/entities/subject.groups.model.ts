import { Groups } from './groups.model';
import { Chat } from './chats.model';
export class SubjectGroups {
    id: number;
    name: string;
    unread: number;
    groups?: Chat[];
}