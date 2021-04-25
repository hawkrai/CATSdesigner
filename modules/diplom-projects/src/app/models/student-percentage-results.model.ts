import {Student} from './student.model';
import {PercentageResult} from './percentage-result.model';

export class StudentPercentageResults extends Student {
  LecturerName: string;
  MarkDate: string;
  Comment: string;
  PercentageResults: PercentageResult[];
  ShowForStudent: boolean;
}
