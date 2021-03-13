import { Pipe, PipeTransform } from '@angular/core';
import { Practical } from 'src/app/models/practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';

@Pipe({
  name: 'visit'
})
export class VisitPipe implements PipeTransform {

  transform(value: StudentMark, ...args: [string, Practical[]]): any {
    const practical = args[1].find(res => res.PracticalId.toString() === args[0].toString());
    const scheduleIds = [];
    practical.ScheduleProtectionPracticalsRecommended.forEach(schedule => {
      if (schedule.Mark === '10') {
        scheduleIds.push(schedule.ScheduleProtectionId.toString());
      }
    });

    const marks = value.PracticalVisitingMark.filter(visiting => scheduleIds.includes(visiting.ScheduleProtectionPracticalId.toString()));

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
