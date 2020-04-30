import {Attachment} from "./attachment.model";

export class Lab {
  labId: string;
  attachments: Attachment[];
  duration: number;
  order: number;
  pathFile: number;
  scheduleProtectionLabsRecomend: ScheduleProtectionLabsRecomend[];
  shortName: string;
  subGroup: number;
  subjectId: string;
  theme: string;
}

export class ScheduleProtectionLabsRecomend {
  mark: number;
  scheduleProtectionId: string;
}

export class ScheduleProtectionLab {
  scheduleProtectionLabId: string;
  date: Date;
  subGroup: number;
  subGroupId: string;
}
