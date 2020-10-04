import { SubjectForm } from './../../models/subject-form.model';
import {createAction, props} from "@ngrx/store";
import {User} from '../../models/user.model';
import {Subject} from '../../models/subject.model';

export const setSubject = createAction(
  '[Subject] Set Subject',
  props<{ subject: Subject }>()
);

export const setUser = createAction(
  '[Subject] Set User',
  props<{ user: User }>()
);

export const loadSubjects = createAction(
  '[Subject] Load Subjects'
);

export const loadSubjectsSuccess = createAction(
  '[Subject] Load Subjects Success',
  props<{ subjects: Subject[] }>()
);

export const saveSubjectSuccess = createAction(
  '[Subject] Save Subject Success'
);

export const saveSubject = createAction(
  '[Subject] Save Subject',
  props<{ subject: SubjectForm }>()
);

export const deleteSubject = createAction(
  '[Subject] Delete Subject',
  props<{ id: number }>()
);

export const deleteSubjectSuccess = createAction(
  '[Subject] Delete Subject Success'
);

// todo
export const loadSubjectsFail = createAction(
  '[Subject] Load Subjects Fail',
  props<{ error: any }>()
);
