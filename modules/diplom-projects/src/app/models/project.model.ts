import { Attachment } from './attachment.model'

export class Project {
  Id: string
  Order: number
  Theme: string
  Student: string
  StudentId: number
  Group: string
  ApproveDate: string
  ApproveDateString: string
  Attachment: Attachment
}
