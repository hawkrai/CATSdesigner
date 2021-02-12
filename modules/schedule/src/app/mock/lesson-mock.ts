import {Lesson} from '../model/lesson.model';
import {formatDate} from '@angular/common';

const format = 'dd.MM.yyyy';
const locale = 'en-US';

export const LESSONS: Lesson[] = [
  {id: '1', date: new Date(formatDate('11/02/2021', format, locale)),
    startTime: '17:05',
    endTime: '19:05',
    shortname: 'ООП', teacher: 'Белова' , title: '123 - Лекция',
    type: null, building: '12', audience: '104',
    color: 'green', subjectId: '1', memo: {message: '2234234'}},
  {id: '2', date: new Date(formatDate('11/02/2021', format, locale)),
    startTime: '08:05',
    endTime: '13:05', shortname: 'ЯП', teacher: 'Гурский' , title: '123 - Лекция', type: null,
    building: '12', audience: '104', color: 'red',
    subjectId: '1', memo: {message: '2234234'}}
];

export const les: any = {
  Labs: LESSONS
};

export const SUBJECTS: any[] = [
  {
    Color: '#ca0000',
    Completing: 0,
    Id: 1,
    Name: 'Тестовый предмет 2',
    ShortName: 'ТП2',
  }
];
