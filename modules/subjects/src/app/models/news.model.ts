import { Attachment } from './attachment.model';

export class News {
  id: string;
  title: string;
  body: string;
  dateCreate: string;
  disabled: boolean;
  subjectId: string;
  pathFile: string
  attachments?: Attachment[];
}