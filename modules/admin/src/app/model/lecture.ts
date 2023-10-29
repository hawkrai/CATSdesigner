export class LectureResponse {
  Code: string
  DataD: string
  Message: string
  Lectures: Item[]
}

export class LabResponse {
  Code: string
  DataD: string
  Message: string
  Labs: Item[]
  ScheduleProtectionLabs: string
}

export class PracticalResponse {
  Code: string
  DataD: string
  Message: string
  Practicals: Item[]
}

export class Item {
  Attachments: Attachment[]
  Duration: number
  LecturesId: number
  Order: number
  PathFile: string
  SubjectId: number
  ShortName: string
  Theme: string
}

export class Attachment {
  Id: number
  AttachmentType: number
  FileName: string
  Name: string
  PathName: string
}
