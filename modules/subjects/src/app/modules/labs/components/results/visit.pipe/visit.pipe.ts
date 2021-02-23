import {Pipe, PipeTransform} from '@angular/core';
import {Lab} from '../../../../../models/lab.model';

@Pipe({
  name: 'checkVisit'
})
export class VisitPipe implements PipeTransform {
  transform(value: any, ...args: [string, Lab[]]): any {
    const lab = args[1].find(res => res.LabId.toString() === args[0].toString() && res.SubGroup === value.SubGroup);
    const scheduleIds = [];
    lab.ScheduleProtectionLabsRecommended.forEach(schedule => {
      if (schedule.Mark === '10') {
        scheduleIds.push(schedule.ScheduleProtectionId.toString());
      }
    });

    const marks = value.LabVisitingMark.filter(visiting => scheduleIds.includes(visiting.ScheduleProtectionLabId.toString()));

    let isNotVisit = false;
    for(let i = 0; i < marks.length; i++) {
      if (marks[i].Mark) {
        isNotVisit = true;
        break;
      }
    }
    return isNotVisit;
  }
}
