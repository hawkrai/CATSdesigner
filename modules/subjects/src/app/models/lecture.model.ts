import { Attachment } from './file/attachment.model'

export class Lecture {
  LecturesId: number
  Order: number
  Theme: string
  Duration: number
  PathFile: string
  SubjectId: number
  Attachments: Attachment[]
}
