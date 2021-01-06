import {User} from '../../models/user.model';
import {Subject} from '../../models/subject.model';

export interface ISubjectState {
  selectedSubject: { id: number, color: string };
  user: User;
  subjects: Subject[]
};

export const initialSubjectState: ISubjectState = {
  selectedSubject: null,
  user: null,
  subjects: []
};
