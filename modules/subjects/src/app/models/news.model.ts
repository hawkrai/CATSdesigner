import { Attachment } from './attachment.model';

export class News {
  id: number;
  title: string;
  body: string;
  dateCreate: string;
  disabled: boolean;
  subjectId: string;
  attachments?: Attachment[];
}
