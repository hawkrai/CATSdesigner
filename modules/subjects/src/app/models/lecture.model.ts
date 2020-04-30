import { Attachment } from './attachment.model';

export class Lecture {
  id: string;
  order: string;
  theme: string;
  duration: string;
  pathFile: string;
  subjectId: string;
  attachments: Attachment[] | any;
}
