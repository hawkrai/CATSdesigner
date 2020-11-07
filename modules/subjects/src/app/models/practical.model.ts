import { Attachment } from './attachment.model';

export class Practical {
    Theme: string;
    PracticalId: number;
    Duration: number;
    SubjectId: number;
    Order: number;
    PathFile: number;
    ShortName: string;
    Attachments: Attachment[]
}