import {Attachment} from "./attachment.model";

export class Lab {
  labId: string;
  attachments: Attachment[] | any;
  duration: number;
  order: number;
  pathFile: string;
  scheduleProtectionLabsRecomend: ScheduleProtectionLabsRecomend[];
  shortName: string;
  subGroup: number;
  subjectId: number;
  theme: string;
}

export class ScheduleProtectionLabsRecomend {
  mark: number;
  scheduleProtectionId: string;
}

export class ScheduleProtectionLab {
  id: string;
  date: string;
  subGroup: number;
  subGroupId: string;
}
