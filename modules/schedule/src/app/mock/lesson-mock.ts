import {Lesson} from '../model/lesson.model';

export const LESSONS: Lesson[] = [
  {id: '1', start: new Date('2020-09-24 11:40'),
    end: new Date('2020-09-24 14:05'),
    shortname: 'ООП', name: '12312', teacher: 'Белова' ,
    type: 'Лекция', building: '12', classroom: '104',
    color: 'green', subjectId: '1'},
  {id: '2', start: new Date('2020-09-15 15:50'),
    end: new Date('2020-09-15 17:25'), shortname: 'ЯП',
    name: '12312', teacher: 'Гурский' , type: 'Лекция',
    building: '12', classroom: '104', color: 'red',
    subjectId: '1'}
];
