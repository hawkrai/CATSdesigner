import {Pipe, PipeTransform} from '@angular/core';

import {Lab, ScheduleProtectionLab} from '../../../../../models/lab.model';
import { StudentMark } from './../../../../../models/student-mark.model';


@Pipe({
  name: 'markProperty'
})
export class MarkPropertyPipe implements PipeTransform {
  transform(value: StudentMark, labId: string, { labs, scheduleProtectionLabs }: { labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[] }): any {
    const markProperty = {mark: null, recommendedMark: null};
    const mark = value.Marks.find(mark => mark.LabId.toString() === labId);
    if (mark && mark.Mark) {
      markProperty.mark = mark;
    } else {
      for (let i = 0; i < scheduleProtectionLabs.length; i++) {
        const calendar = scheduleProtectionLabs[i];
        const oldDateArr = calendar.date.split('.');
        const oldDate = new Date(oldDateArr[1] + '.' + oldDateArr[0] + '.' + oldDateArr[2]);
        if (oldDate.valueOf() === new Date().valueOf()) {
          const lab = labs.find(lab => lab.labId === labId);
          const scheduleProtectionLab = lab.scheduleProtectionLabsRecomend.find(res =>
            res.scheduleProtectionId.toString() === calendar.id.toString()
          );

          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.mark;
          }
        } else if (oldDate > new Date()) {
          const lab = labs.find(lab => lab.labId === labId);
          const scheduleProtectionLab = lab.scheduleProtectionLabsRecomend.find(res =>
            res.scheduleProtectionId.toString() === calendar.id.toString()
          );

          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.mark;
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
