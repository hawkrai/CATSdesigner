import {Memo} from './memo.model';

export class Lesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: string;
  teacher: string;
  title: string;
  shortname: string;
  building: string;
  audience: string;
  color: string;
  subjectId: string;
  memo: Memo;
}
