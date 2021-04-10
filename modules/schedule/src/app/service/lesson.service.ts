import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DatePipe, formatDate} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  lessonTypes: string[][] = [['1', 'Лекция'], ['2', 'Лаб. работа'], ['3', 'Практ. работа'],
    ['4', 'КП'], ['5', 'ДП']];

  lessonTypesFull: string[][] = [['1', 'Лекция'], ['2', 'Лабораторная работа'], ['3', 'Практическая работа'],
    ['4', 'Консультация по курсовому проекту'], ['5', 'Консультация по дипломному проекту']];

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }
  getAllLessons(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoCalendar', {userLogin: username});
  }

  getGroupsBySubjectId(id: number): Observable<any> {
    return this.http.get<any>('/Services/CoreService.svc/GetGroupsV2/' + id);
  }

  getLessonsByDates(start: string, end: string): Observable<any> {
    return this.http.get<any>('/Services/Schedule/ScheduleService.svc/GetSchedule?dateStart=' + start + '&dateEnd=' + end);
  }

  saveLab(Lab: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDateLab',
      {subjectId: Lab.subjectId, date: Lab.date, startTime: Lab.startTime,
            endTime: Lab.endTime, building: Lab.building, audience: Lab.audience, subGroupId: Lab.subGroupId});
  }

  savePractical(pract: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDatePractical',
      {subjectId: pract.subjectId, date: pract.date, startTime: pract.startTime,
            endTime: pract.endTime, building: pract.building, audience: pract.audience, groupId: pract.groupId });
  }

  saveLecture(lect: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDateLectures',
      {subjectId: lect.subjectId, date: lect.date, startTime: lect.startTime,
            endTime: lect.endTime, building: lect.building, audience: lect.audience});
  }

  deleteLab(idLab: any): Observable<any> {
    return this.http.post<any>('/Services/Labs/LabsService.svc/Delete', {id: idLab});
  }

  deletePractical(idPract: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/DeletePracticalScheduleDate', {id: idPract});
  }

  getLessonsByDateAndTimes(date: string, start: string, end: string): Observable<any> {
    return this.http.get<any>('/Services/Schedule/GetScheduleBetweenTime?date=' + date + '&startTime=' + start + '&endTime=' + end);

  }

  deleteLecture(lectId: any): Observable<any> {
    return this.http.post<any>('/Services/Lectures/LecturesService.svc/Delete', {id: lectId});
  }

  getAllSubjects(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoSubjects', {userLogin: username});
  }

  getSubject(title: string): any {
    const splitted = title.split('|', 9);
    return splitted[8];
  }

  getType(title: string): any {
    const splitted = title.split('|', 5);
    return ' ' + splitted[4] + ' ';
  }

  getColor(title: string): any {
    const splitted = title.split('|', 7);
    return splitted[6];
  }

  getTeacher(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5];
  }

  getAudience(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[1];
  }

  getBuilding(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[2];
  }

  getMemo(title: string): any {
    const splitted = title.split('|', 10);
    return splitted[9];
  }

  getThirdString(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5];
  }

  getColorLesson(event: any): any {
    if (this.isLesson(event)) {
      const splitted = event.title.split('|', 7);
      return splitted[6];
    } else {
      return 'white';
    }
  }

  getReferenceToSubject(title: string): any {
    const splitted = title.split('|', 8);
    return '/Subject?subjectId=' + splitted[7];
  }

  getLocation(title: string): any {
    const splitted = title.split('|', 3);
    let a = splitted[2];
    if (a.length != 0) {
      a = ' к. ' + a;
    }

    return 'а.' + splitted[1] + a;
  }

  getName(title: string): any {
    const splitted = title.split('|', 5);
    return splitted[3];
  }

  getTime(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[0];
  }


  isLesson(event): boolean {
    return event.meta === 'lesson';
  }



  formatDate1(date: Date): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  formatDate2(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  formatDate3(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getLessonType(): any {
    return this.lessonTypes;
  }

  getLessonTypeFull(): any {
    return this.lessonTypesFull;
  }

  getLessonTypeById(id: string): any {
    return this.lessonTypes.find(type => type[0] == id)[1];
  }
}
