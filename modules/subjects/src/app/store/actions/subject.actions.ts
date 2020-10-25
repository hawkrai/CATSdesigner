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
