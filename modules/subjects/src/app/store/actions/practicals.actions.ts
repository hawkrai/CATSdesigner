import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model';
import { createAction, props } from '@ngrx/store';
import { CreateEntity } from 'src/app/models/form/create-entity.model';

import { Practical } from '../../models/practical.model';

export const loadPracticals = createAction(
    '[Practical] Load Practicals'
);

export const loadPracticalsSuccess = createAction(
    '[Practical] Load Practicals Success',
    props<{ practicals: Practical[] }>()
);

export const loadMarks = createAction(
    '[Practical] Load Marks'
);

export const loadMarksSucces = createAction(
    '[Practical] Load Marks Success'
);

export const deletePractical = createAction(
    '[Practical] Delete Practical',
    props<{ id: number }>()
);

export const savePractical = createAction(
    '[Practical] Save Practical',
    props<{ practical: CreateLessonEntity }>()
);

export const resetPracticals = createAction(
    '[Practical] Reset Practicals'
);

export const updatePracticals = createAction(
    '[Practical] Update Practicals',
    props<{ practicals: Practical[] }>()
);

