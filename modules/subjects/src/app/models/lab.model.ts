import {Attachment} from "./file/attachment.model";
import { ScheduleProtectionRecommended } from "./schedule-protection/schedule-protection-recommended.model";

export class Lab {
  LabId: number;
  Attachments: Attachment[];
  Duration: number;
  Order: number;
  PathFile: string;
  ScheduleProtectionLabsRecommended: ScheduleProtectionRecommended[];
  ShortName: string;
  SubGroup: number;
  SubjectId: number;
  Theme: string;
}


