import {User} from '../../models/user.model';
import {Subject} from '../../models/subject.model';

export interface ISubjectState {
  subject: Subject;
  user: User;
  subjects: Subject[];
};

export const initialSubjectState: ISubjectState = {
  subject: null,
  user: null,
  subjects: []
};
