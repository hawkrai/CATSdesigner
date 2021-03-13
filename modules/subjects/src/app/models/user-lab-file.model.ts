import { Attachment } from './file/attachment.model';

export class UserLabFile {
    Id: number;
    Comments: string;
    Date: string;
    PathFile: string;
    IsReceived: boolean;
    IsReturned: boolean;
    Attachments: Attachment[]
    LabId?: number
}