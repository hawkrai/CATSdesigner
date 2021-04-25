import { Attachment } from './Attachment'

export class ComplexCascade{
  Id: string;
  Name: string;
  Published: boolean;
  SubjectName: string;
  FilePath: string;
  IsGroup: boolean;
  ParentId: number;
  IncludeLabs?: boolean;
  IncludeLecturers?: boolean;
  IncludeTests?: boolean;
  Attachments: Attachment[];
  children?: ComplexCascade[];
}
