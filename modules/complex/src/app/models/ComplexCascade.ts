import { Attachment } from './Attachment'

export class ComplexCascade{
  Id: string;
  Name: string;
  Published: boolean;
  SubjectName: string;
  FilePath: string;
  IsGroup: boolean;
  ParentId: number; 
  Attachments: Attachment[];
  children?: ComplexCascade[];
}
