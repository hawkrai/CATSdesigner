import { Attachment } from './file/attachment.model';
import { ScheduleProtectionRecommended } from './schedule-protection/schedule-protection-recommended.model';

export class Practical {
    Theme: string;
    PracticalId: number;
    Duration: number;
    SubjectId: number;
    Order: number;
    PathFile: string;
    ShortName: string;
    Attachments: Attachment[]
    ScheduleProtectionPracticalsRecommended: ScheduleProtectionRecommended[]
}
