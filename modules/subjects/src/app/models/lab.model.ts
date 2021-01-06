import {Attachment} from "./file/attachment.model";

export class Lab {
  LabId: number;
  Attachments: Attachment[];
  Duration: number;
  Order: number;
  PathFile: string;
  ScheduleProtectionLabsRecomend: ScheduleProtectionLabsRecomend[];
  ShortName: string;
  SubGroup: number;
  SubjectId: number;
  Theme: string;
}

export class ScheduleProtectionLabsRecomend {
  Mark: string;
  ScheduleProtectionId: number;
}

export class ScheduleProtectionLabs {
  ScheduleProtectionLabId: number;
  Date: string;
  SubGroup: number;
  SubGroupId: number;
}
