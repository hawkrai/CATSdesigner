import { Group } from "./group.model";
import { SubjectLector } from "./subject-letor.model";

export class Subject {
  SubjectId: number;
  DisplayName: string;
  Name: string;
  GroupsCount: number;
  StudentsCount: number;
  Lectors: SubjectLector[];
  Groups: Group[];
  Owner: number;
}
