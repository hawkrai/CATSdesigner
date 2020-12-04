import { Attachment } from './attachment.model';

export class Practical {
    Theme: string;
    PracticalId: number;
    Duration: number;
    SubjectId: number;
    Order: number;
    PathFile: string;
    ShortName: string;
    Audience: number;
    BuildingNumber: string;
    Start: Date;
    End: Date;
    Attachments: Attachment[]
}