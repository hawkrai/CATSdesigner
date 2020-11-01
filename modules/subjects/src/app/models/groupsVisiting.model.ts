import {Mark} from "./mark.model";

export class GroupsVisiting {
  groupId: string;
  lecturesMarksVisiting: LecturesMarksVisiting[];
}

export class LecturesMarksVisiting {
  Login: string;
  StudentId: string;
  StudentName: string;
  Marks: Mark[];
}
