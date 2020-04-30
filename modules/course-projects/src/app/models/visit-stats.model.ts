import {Student} from './student.model';
import {ConsultationMark} from './consultation-mark.model';

export class VisitStats extends Student {
  CourseProjectConsultationMarks: ConsultationMark[];
}
