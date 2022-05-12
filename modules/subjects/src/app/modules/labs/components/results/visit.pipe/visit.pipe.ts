import {Pipe, PipeTransform} from '@angular/core';
import { StudentMark } from 'src/app/models/student-mark.model';
import { LabVisitingMark } from 'src/app/models/visiting-mark/lab-visiting-mark.model';
import {Lab} from '../../../../../models/lab.model';

@Pipe({
  name: 'checkVisit'
})
export class VisitPipe implements PipeTransform {
  transform(value: StudentMark, ...args: [string, Lab[]]): LabVisitingMark[] {
    const lab = args[1].find(res => res.LabId.toString() === args[0].toString() && res.SubGroup === value.SubGroup);
    const scheduleIds = [];
    lab.ScheduleProtectionLabsRecommended.forEach(schedule => {
      if (schedule.Mark === '10') {
        scheduleIds.push(schedule.ScheduleProtectionId.toString());
      }
    });
    
    return value.LabVisitingMark.filter(visiting => scheduleIds.includes(visiting.ScheduleProtectionLabId.toString()) && visiting.Mark);

  }
}
