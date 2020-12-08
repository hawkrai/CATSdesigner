import { Attachment } from './file/attachment.model';

export class News {
  NewsId: number;
  Title: string;
  Body: string;
  DateCreate: string;
  Disabled: boolean;
  SubjectId: number;
  PathFile: string;
  Attachments: Attachment[];
}
