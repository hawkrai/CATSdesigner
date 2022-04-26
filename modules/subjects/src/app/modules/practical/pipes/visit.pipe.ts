import { Pipe, PipeTransform } from '@angular/core';
import { Practical } from 'src/app/models/practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { PracticalVisitingMark } from 'src/app/models/visiting-mark/practical-visiting-mark.model';

@Pipe({
  name: 'visit'
})
export class VisitPipe implements PipeTransform {

  transform(value: StudentMark, ...args: [string, Practical[]]): PracticalVisitingMark[] {
    const practical = args[1].find(res => res.PracticalId.toString() === args[0].toString());
    const scheduleIds = [];
    practical.ScheduleProtectionPracticalsRecommended.forEach(schedule => {
      if (schedule.Mark === '10') {
        scheduleIds.push(schedule.ScheduleProtectionId.toString());
      }
    });
    
    return value.PracticalVisitingMark.filter(visiting => scheduleIds.includes(visiting.ScheduleProtectionPracticalId.toString()) && visiting.Mark);

  }
}
