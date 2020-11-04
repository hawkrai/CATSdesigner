import { SubjectForm } from '../../models/subject-form.model';
import {createAction, props} from "@ngrx/store";
import {User} from '../../models/user.model';
import {Subject} from '../../models/subject.model';

export const setSubjectId = createAction(
  '[Subject] Set Subject',
  props<{ id: number }>()
);

export const setUser = createAction(
  '[Subject] Set User',
  props<{ user: User }>()
);

export const saveSubject = createAction(
  '[Subject] Save Subject',
  props<{ subject: SubjectForm }>()
);

export const loadSubjects = createAction(
  '[Subject] Load Subjects'
);

export const loadSubjectsSuccess = createAction(
  '[Subject] Load Subjects Success',
  props<{ subjects: Subject[] }>()
);

export const deleteSubejctById = createAction(
  '[Subject] Delete Subject By Id',
  props<{ subjectId: number }>()
);

export const resetSubjects = createAction(
  '[Subjects] Reset Subjects'
);