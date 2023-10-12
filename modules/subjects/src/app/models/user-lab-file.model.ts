import { Attachment } from './file/attachment.model'

export class UserLabFile {
  Id: number
  Comments: string
  Date: string
  PathFile: string
  IsReceived: boolean
  IsReturned: boolean
  Attachments: Attachment[]
  LabId?: number
  UserId: number
  LabShortName?: string
  Order?: number
  LabTheme?: string
  PracticalId?: number
  PracticalShortName?: string
  PracticalTheme?: string
}
