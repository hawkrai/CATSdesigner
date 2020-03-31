import { Attachment } from './attachment.model';

export class Project {
  Id: number;
  Order: number;
  Theme: string;
  Student: string;
  StudentId: number;
  Group: string;
  ApproveDate: string;
  ApproveDateString: string;
  Attachment: Attachment;
}
