import {Mark} from "./mark.model";

export class GroupsVisiting {
  groupId: string;
  lecturesMarksVisiting: LecturesMarksVisiting[];
}

export class LecturesMarksVisiting {
  login: string;
  studentId: string;
  studentName: string;
  marks: Mark[];
}
