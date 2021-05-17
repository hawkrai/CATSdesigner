import { Group } from "./group.model";

export class Subject {
  SubjectId: number;
  DisplayName: string;
  Name: string;
  GroupsCount: number;
  StudentsCount: number;
  Groups: Group[];
}
