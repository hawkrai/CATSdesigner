import {Lesson} from '../model/lesson.model';

export const LESSONS: Lesson[] = [
  {id: '1', Date: '11/02/2021',
    Start: '17:05',
    End: '19:05', Name: '123',
    ShortName: 'ООП', Teacher: 'Белова' ,
    Type: null, Building: '12', Audience: '104',
    Color: 'green', SubjectId: '1', Notes: [{message: '2234234'}]}
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
