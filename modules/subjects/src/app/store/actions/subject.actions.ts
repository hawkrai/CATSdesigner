import { createAction, props } from '@ngrx/store'
import { SubjectForm } from '../../models/form/subject-form.model'
import { Subject } from '../../models/subject.model'
import { User } from '../../models/user.model'

export const setSubject = createAction(
  '[Subject] Set Subject',
  props<{ subject: { id: number; color: string; subjectName: string } }>()
)

export const setUser = createAction(
  '[Subject] Set User',
  props<{ user: User }>()
)

export const saveSubject = createAction(
  '[Subject] Save Subject',
  props<{ subject: SubjectForm }>()
)

export const loadSubjects = createAction('[Subject] Load Subjects')

export const loadSubjectsSuccess = createAction(
  '[Subject] Load Subjects Success',
  props<{ subjects: Subject[] }>()
)

export const deleteSubjectById = createAction(
  '[Subject] Delete Subject By Id',
  props<{ subjectId: number }>()
)

export const resetSubjects = createAction('[Subjects] Reset Subjects')

export const loadSubject = createAction(
  '[Subject] Load Subject',
  props<{ subjectId: number }>()
)

export const loadSubjectSuccess = createAction(
  '[Subject] Load Subject Success',
  props<{ subject: Subject }>()
)
