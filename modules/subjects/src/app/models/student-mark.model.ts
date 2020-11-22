import { LabMark } from './mark/lab-mark.model';
import { LabVisitingMark } from './visiting-mark/lab-visiting-mark.model';

export class StudentMark {
    FullName: string;
    SubGroup: number;
    StudentId: number;
    LabsMarkTotal: string;
    TestMark: string;
    LabVisitingMark: LabVisitingMark[];
    Marks: LabMark[];
    AllTestsPassed: boolean;
}