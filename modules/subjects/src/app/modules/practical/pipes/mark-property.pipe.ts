import {Pipe, PipeTransform} from '@angular/core';
import { PracticalMark } from 'src/app/models/mark/practical-mark.model';

import { Practical } from 'src/app/models/practical.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';


@Pipe({
  name: 'markProperty'
})
export class MarkPropertyPipe implements PipeTransform {
  transform(value: StudentMark, practicalId: number, practicals: Practical[], schedule: ScheduleProtectionPractical[]): { mark: PracticalMark, recommendedMark: string } {
    const markProperty = {mark: null, recommendedMark: null};
    const mark = value.PracticalsMarks.find(mark => mark.PracticalId === practicalId);
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
          const practical = practicals.find(practical => practical.PracticalId === practicalId);
          const scheduleProtectionPractical = practical.ScheduleProtectionPracticalsRecommended.find(res =>
            res.ScheduleProtectionId === calendar.ScheduleProtectionPracticalId
          );
          if (scheduleProtectionPractical) {
            markProperty.recommendedMark = scheduleProtectionPractical.Mark;
          }
        } else if (oldDate.valueOf() > now.valueOf()) {
          const practical = practicals.find(practical => practical.PracticalId === practicalId);
          const scheduleProtectionPractical = practical.ScheduleProtectionPracticalsRecommended.find(res =>
            res.ScheduleProtectionId === calendar.ScheduleProtectionPracticalId
          );

          if (scheduleProtectionPractical) {
            markProperty.recommendedMark = scheduleProtectionPractical.Mark;
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
