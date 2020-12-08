import {Pipe, PipeTransform} from '@angular/core';

import { Lab, ScheduleProtectionLabs } from '../../../../../models/lab.model';
import { StudentMark } from './../../../../../models/student-mark.model';


@Pipe({
  name: 'markProperty'
})
export class MarkPropertyPipe implements PipeTransform {
  transform(value: StudentMark, labId: number, { labs, scheduleProtectionLabs }: { labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLabs[] }): any {
    const markProperty = {mark: null, recommendedMark: null};
    const mark = value.Marks.find(mark => mark.LabId === labId);
    if (mark && mark.Mark) {
      markProperty.mark = mark;
    } else {
      for (let i = 0; i < scheduleProtectionLabs.length; i++) {
        const calendar = scheduleProtectionLabs[i];
        const oldDateArr = calendar.Date.split('.');
        const oldDate = new Date(oldDateArr[1] + '.' + oldDateArr[0] + '.' + oldDateArr[2]);
        if (oldDate.valueOf() === new Date().valueOf()) {
          const lab = labs.find(lab => lab.LabId === labId);
          const scheduleProtectionLab = lab.ScheduleProtectionLabsRecomend.find(res =>
            res.ScheduleProtectionId === calendar.ScheduleProtectionLabId
          );

          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.Mark;
          }
        } else if (oldDate > new Date()) {
          const lab = labs.find(lab => lab.LabId === labId);
          const scheduleProtectionLab = lab.ScheduleProtectionLabsRecomend.find(res =>
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
