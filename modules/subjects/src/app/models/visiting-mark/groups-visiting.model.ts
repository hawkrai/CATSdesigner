import {Mark} from '../mark.model';

export class GroupsVisiting {
  GroupId: number;
  LecturesMarksVisiting: LecturesMarksVisiting[];
}

export class LecturesMarksVisiting {
  Login: string;
  StudentId: number;
  StudentName: string;
  Marks: Mark[];
}
