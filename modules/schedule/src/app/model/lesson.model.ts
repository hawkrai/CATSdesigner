import {Memo} from './memo.model';

export class Lesson {
  id: string;
  Date: string;
  Start: string;
  End: string;
  Type: string;
  Teacher: any;
  Name: string;
  ShortName: string;
  Building: string;
  Audience: string;
  Color: string;
  SubjectId: string;
  Notes: Memo[];
}
