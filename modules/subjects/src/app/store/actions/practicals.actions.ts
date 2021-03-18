import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model';
import { createAction, props } from '@ngrx/store';

import { Practical } from '../../models/practical.model';
import { PracticalVisitingMark } from 'src/app/models/visiting-mark/practical-visiting-mark.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';

export const loadPracticals = createAction(
    '[Practicals] Load Practicals'
);

export const loadPracticalsSuccess = createAction(
    '[Practicals] Load Practicals Success',
    props<{ practicals: Practical[] }>()
);

export const loadSchedule = createAction(
    '[Practicals] Load Practicals Schedule',
);

export const loadScheduleSuccess = createAction(
    '[Practicals] Load Practivals Schedule Success',
    props<{ schedule: ScheduleProtectionPractical[] }>()
);

export const loadMarks = createAction(
    '[Practicals] Load Marks'
);

export const loadMarksSuccess = createAction(
    '[Practicals] Load Marks Success',
    props<{ students: StudentMark[] }>()
);

export const deletePractical = createAction(
    '[Practicals] Delete Practical',
    props<{ id: number }>()
);

export const savePractical = createAction(
    '[Practicals] Save Practical',
    props<{ practical: CreateLessonEntity }>()
);

export const resetPracticals = createAction(
    '[Practicals] Reset Practicals'
);

export const updateOrder = createAction(
    '[Practicals] Update Order',
    props<{ prevIndex: number, currentIndex: number }>()
);

export const createDateVisit = createAction(
    '[Practicals] Create Date Visit',
    props<{ obj: { date: string, startTime: string, endTime: string, building: string, audience: string } }>()
  );
  
export const deleteDateVisit = createAction(
    '[Practicals] Delete Date Visit',
    props<{ id: number }>()
);

export const setPracticalsVisitingDate = createAction(
    '[Practicals] Set Practicals Visiting Date',
    props<{ visiting: { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } }>()
);

export const setPracticalMark = createAction(
    '[Practicals] Set Practical Mark',
    props<{ body: { studentId: number, practicalId: number, mark: string, comment: string, date: string, id: number, showForStudent: boolean } }>()
);