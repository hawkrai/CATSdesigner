import { LabMark } from './mark/lab-mark.model';
import { PracticalMark } from './mark/practical-mark.model';
import { UserLabFile } from './user-lab-file.model';
import { LabVisitingMark } from './visiting-mark/lab-visiting-mark.model';
import { PracticalVisitingMark } from './visiting-mark/practical-visiting-mark.model';

export class StudentMark {
    FullName: string;
    SubGroup: number;
    StudentId: number;
    PracticalsMarkTotal: string;
    PracticalVisitingMark: PracticalVisitingMark[];
    PracticalsMarks: PracticalMark[]
    LabsMarkTotal: string;
    LabVisitingMark: LabVisitingMark[];
    LabsMarks: LabMark[];
    TestMark: string;
    FileLabs: UserLabFile[]
    AllTestsPassed: boolean;
}