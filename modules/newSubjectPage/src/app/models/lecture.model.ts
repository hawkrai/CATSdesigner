import { Attachment } from './attachment.model';

export class Lecture {
  id: string;
  order: number;
  theme: string;
  duration: number;
  pathFile: string;
  subjectId: string;
  attachments: Attachment[];
}
