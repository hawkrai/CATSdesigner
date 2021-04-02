import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {les, SUBJECTS} from '../mock/lesson-mock';
import {DatePipe, formatDate} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  lessonTypes: string[][] = [['1', 'Лекция'], ['2', 'Лаб.работа'], ['3', 'Практ.работа']];

  lessonTypesFull: string[][] = [['1', 'Лекция'], ['2', 'Лабораторная работа'], ['3', 'Практическая работа']];

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }

  getLessons(): Observable<any> {
    return of(les);
  }

  getSubjects(): Observable<any> {
    return of(SUBJECTS);
  }


  getAllLessons(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoCalendar', {userLogin: username});
  }

  getLessonsByDates(start: string, end: string): Observable<any> {
    return this.http.get<any>('/Services/Schedule/ScheduleService.svc/GetSchedule?dateStart=' + start + '&dateEnd=' + end);
  }

  saveLab(Lab: any): Observable<any> {
    return this.http.post<any>('/Services/Labs/ScheduleService.svc/SaveDateLab', {lab: Lab});
  }

  savePractical(pract: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDatePractical', {lab: pract});
  }

  saveLecture(lect: any): Observable<any> {
    return this.http.post<any>('/Services/Schedule/ScheduleService.svc/SaveDateLectures', {lecture: lect});
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
    return 'а.' + splitted[1] + ' к.' + splitted[2];
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
