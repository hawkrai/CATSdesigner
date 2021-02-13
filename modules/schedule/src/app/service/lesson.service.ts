import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {les, SUBJECTS} from '../mock/lesson-mock';
import {DatePipe, formatDate} from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }

  getLessons(): Observable<any> {
    return of(les);
  }

  getSubjects(): Observable<any> {
    return of(SUBJECTS);
  }


  getAllLessons(username: string ): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoCalendar', {userLogin: username});
  }

  getAllSubjects(username: string ): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoSubjects', {userLogin: username});
  }

  getSubject(title: string, subjects: any): any {
    const splitted = title.split('|', 8);
    return subjects.find(subject => subject.Id == splitted[7]).Id;
  }

  getType(title: string): any {
    const splitted = title.split('|', 5);
    return ' ' + splitted[4] + ' ';
  }

  getColor(title: string): any {
    const splitted = title.split('|', 7);
    return splitted[6] ;
  }

  getTeacher(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5] ;
  }

  getAudience(title: string): any {
    const splitted = title.split('|', 3);
    return  splitted[1];
  }

  getBuilding(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[2];
  }

  getMemo(title: string): any {
    const splitted = title.split('|', 9);
    return splitted[8] ;
  }

  getThirdString(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5] ;
  }

  getColorLesson(event: any): any {
    if (this.isLesson(event)) {
      const splitted = event.title.split('|', 7);
      return splitted[6] ;
    } else {
      return 'white';
    }
  }

  getReferenceToSubject(title: string): any {
    const splitted = title.split('|', 8);
    return '/Subject?subjectId=' + splitted[7] ;
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

  formatDate(date: Date): Date {
    return new Date(this.datePipe.transform(date, 'MM-dd-yyyy'));
  }

  formatDate1(date: Date): Date {
    const format = 'dd.MM.yyyy';
    const locale = 'en-US';
    return new Date(formatDate(this.datePipe.transform(date, 'dd-MM-yyyy'), format, locale));
  }
}
