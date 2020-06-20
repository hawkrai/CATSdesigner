import {Pipe, PipeTransform} from '@angular/core';
import {Lab, ScheduleProtectionLab} from '../../../../../models/lab.model';

@Pipe({
  name: 'markProperty'
})
export class MarkPropertyPipe implements PipeTransform {
  transform(value: any, ...args: [string, { labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[] }]): any {
    const markProperty = {mark: null, recommendedMark: null};
    const mark = value.Marks.find(res => res.LabId.toString() === args[0]);
    if (mark && mark.Mark) {
      markProperty.mark = mark.Mark;
    } else {
      for (let i = 0; i < args[1].scheduleProtectionLabs.length; i++) {
        const calendar = args[1].scheduleProtectionLabs[i];
        const oldDateArr = calendar.date.split('.');
        const oldDate = new Date(oldDateArr[1] + '.' + oldDateArr[0] + '.' + oldDateArr[2]);
        if (oldDate.valueOf() === new Date().valueOf()) {
          const lab = args[1].labs.find(lab => lab.labId.toString() === args[0]);
          const scheduleProtectionLab = lab.scheduleProtectionLabsRecomend.find(res =>
            res.scheduleProtectionId.toString() === calendar.id.toString()
          );

          if (scheduleProtectionLab) {
            markProperty.recommendedMark = scheduleProtectionLab.mark;
          }
        } else if (oldDate > new Date()) {
          const lab = args[1].labs.find(lab => lab.labId.toString() === args[0]);
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
