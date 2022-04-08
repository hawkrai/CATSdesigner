import { Attachment } from './attachment.model';

export class Project {
  Id: string;
  Order: number;
  Theme: string;
  Lecturer: string;
  LecturerId: number;
  Student: string;
  StudentId: number;
  Group: string;
  ApproveDate: string;
  ApproveDateString: string;
  Attachment: Attachment;
}
