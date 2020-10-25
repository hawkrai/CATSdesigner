import {User} from '../../models/user.model';
import {Subject} from '../../models/subject.model';

export interface ISubjectState {
  subjectId: number;
  user: User;
};

export const initialSubjectState: ISubjectState = {
  subjectId: null,
  user: null
};
