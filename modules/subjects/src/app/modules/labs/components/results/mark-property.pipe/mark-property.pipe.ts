import { LabMark } from './../../../../../models/mark/lab-mark.model';
import {Pipe, PipeTransform} from '@angular/core';

import { Lab } from '../../../../../models/lab.model';
import { StudentMark } from './../../../../../models/student-mark.model';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';


@Pipe({
  name: 'markProperty'
})
export class MarkPropertyPipe implements PipeTransform {
  transform(value: StudentMark, labId: number, labs: Lab[], schedule: ScheduleProtectionLab[]): { mark: LabMark, recommendedMark: string } {
    const markProperty = {mark: null, recommendedMark: null};
    const mark = value.LabsMarks.find(mark => mark.LabId === labId);
    if (mark && mark.Mark) {
      markProperty.mark = mark;
    } else {
      for (let i = 0; i < schedule.length; i++) {
        const calendar = schedule[i];
        const oldDateArr = calendar.Date.split('.');
        const oldDate = new Date(oldDateArr[1] + '.' + oldDateArr[0] + '.' + oldDateArr[2]);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (oldDate.valueOf() === now.valueOf()) {
          const lab = labs.find(lab => lab.LabId === labId);
          const scheduleProtectionLab = lab.ScheduleProtectionLabsRecommended.find(res =>
            res.ScheduleProtectionId === calendar.ScheduleProtectionLabId
          );
          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.Mark;
          }
        } else if (oldDate.valueOf() > now.valueOf()) {
          const lab = labs.find(lab => lab.LabId === labId);
          const scheduleProtectionLab = lab.ScheduleProtectionLabsRecommended.find(res =>
            res.ScheduleProtectionId === calendar.ScheduleProtectionLabId
          );

          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.Mark;
          }
          break;
        } else {
          markProperty.recommendedMark = "1";
        }
      }
    }
    return markProperty;
  }
}
