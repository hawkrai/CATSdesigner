import { Memo } from './memo.model'
import { Note } from './note.model'

export class Lesson {
  Id: string
  Date: string
  Start: string
  End: string
  Type: string
  Teacher: any
  Name: string
  ShortName: string
  Building: string
  Audience: string
  Color: string
  SubjectId: string
  Notes: Memo[]
  personalNote?: Note
  GroupId: number
  SubGroupId: number
  GroupName: string
  SubGroupName: string
}
