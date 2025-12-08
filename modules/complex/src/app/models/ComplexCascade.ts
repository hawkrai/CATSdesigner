import { Attachment } from './Attachment'

export class ComplexCascade {
  Id: string
  Name: string
  Published: boolean
  SubjectName: string
  FilePath: string
  TestId?: number
  IsGroup: boolean
  ParentId: number
  IncludeLabs?: boolean
  IncludeLectures?: boolean
  IncludeWorkshops?: boolean
  IncludeTests?: boolean
  Attachments: Attachment[]
  children?: ComplexCascade[]
  isSectionNode?: boolean
}
