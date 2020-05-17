import {User} from '../../models/user.model';

export interface ISubjectState {
  subject: any;
  user: User;
}

export const initialSubjectState: ISubjectState = {
  subject: {id: '', Name: ''},
  user: null
};
